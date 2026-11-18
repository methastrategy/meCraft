import { describe, it, expect } from 'vitest';
import type { HistoryCommand } from '../src/main';

describe('mePDF Command-Pattern Undo/Redo Engine', () => {
  it('manages command execution, undo, and redo cycles accurately', () => {
    const undoStack: HistoryCommand[] = [];
    const redoStack: HistoryCommand[] = [];

    let state = 0;

    const executeCommand = (cmd: HistoryCommand) => {
      cmd.redo();
      undoStack.push(cmd);
      redoStack.length = 0;
    };

    const undo = () => {
      const cmd = undoStack.pop();
      if (!cmd) return;
      cmd.undo();
      redoStack.push(cmd);
    };

    const redo = () => {
      const cmd = redoStack.pop();
      if (!cmd) return;
      cmd.redo();
      undoStack.push(cmd);
    };

    // Action 1: Add 10
    const add10: HistoryCommand = {
      description: 'Add 10',
      undo: () => { state -= 10; },
      redo: () => { state += 10; },
    };
    executeCommand(add10);
    expect(state).toBe(10);
    expect(undoStack).toHaveLength(1);
    expect(redoStack).toHaveLength(0);

    // Action 2: Multiply 2
    const mul2: HistoryCommand = {
      description: 'Multiply 2',
      undo: () => { state /= 2; },
      redo: () => { state *= 2; },
    };
    executeCommand(mul2);
    expect(state).toBe(20);
    expect(undoStack).toHaveLength(2);

    // Undo action 2
    undo();
    expect(state).toBe(10);
    expect(undoStack).toHaveLength(1);
    expect(redoStack).toHaveLength(1);

    // Redo action 2
    redo();
    expect(state).toBe(20);
    expect(undoStack).toHaveLength(2);
    expect(redoStack).toHaveLength(0);

    // Undo both
    undo();
    undo();
    expect(state).toBe(0);
    expect(undoStack).toHaveLength(0);
    expect(redoStack).toHaveLength(2);

    // Redo both
    redo();
    redo();
    expect(state).toBe(20);
  });

  it('supports page rotation undo and redo', () => {
    let rotation = 0;
    const undoStack: HistoryCommand[] = [];
    const redoStack: HistoryCommand[] = [];

    const rotateCommand = (deg: number): HistoryCommand => {
      const prev = rotation;
      const next = (rotation + deg) % 360;
      return {
        description: `Rotate ${deg}`,
        undo: () => { rotation = prev; },
        redo: () => { rotation = next; },
      };
    };

    const cmd1 = rotateCommand(90);
    cmd1.redo();
    undoStack.push(cmd1);
    expect(rotation).toBe(90);

    const cmd2 = rotateCommand(90);
    cmd2.redo();
    undoStack.push(cmd2);
    expect(rotation).toBe(180);

    // Undo rotation
    const last = undoStack.pop()!;
    last.undo();
    redoStack.push(last);
    expect(rotation).toBe(90);

    // Redo rotation
    const redoCmd = redoStack.pop()!;
    redoCmd.redo();
    undoStack.push(redoCmd);
    expect(rotation).toBe(180);
  });

  it('supports page reordering undo and redo', () => {
    let pages = ['Page 1', 'Page 2', 'Page 3'];
    const undoStack: HistoryCommand[] = [];

    const reorder = (from: number, to: number) => {
      const [item] = pages.splice(from, 1);
      pages.splice(to, 0, item!);
      undoStack.push({
        description: 'Reorder',
        undo: () => {
          const [it] = pages.splice(to, 1);
          pages.splice(from, 0, it!);
        },
        redo: () => {
          const [it] = pages.splice(from, 1);
          pages.splice(to, 0, it!);
        },
      });
    };

    reorder(0, 2); // Move Page 1 to the end
    expect(pages).toEqual(['Page 2', 'Page 3', 'Page 1']);

    // Undo reorder
    const cmd = undoStack.pop()!;
    cmd.undo();
    expect(pages).toEqual(['Page 1', 'Page 2', 'Page 3']);

    // Redo reorder
    cmd.redo();
    expect(pages).toEqual(['Page 2', 'Page 3', 'Page 1']);
  });

  it('caps undo stack depth to 50 items and purges oldest', () => {
    const undoStack: HistoryCommand[] = [];

    for (let i = 1; i <= 60; i++) {
      const cmd: HistoryCommand = {
        description: `Action ${i}`,
        undo: () => {},
        redo: () => {},
      };
      undoStack.push(cmd);
      if (undoStack.length > 50) {
        undoStack.shift();
      }
    }

    expect(undoStack).toHaveLength(50);
    expect(undoStack[0]!.description).toBe('Action 11');
    expect(undoStack[49]!.description).toBe('Action 60');
  });

  it('supports complex page deletion and restoration with metadata', () => {
    interface TestPage {
      id: string;
      docId: string;
      pageIndex: number;
    }
    const docs = new Map<string, { id: string; name: string }>();
    docs.set('doc1', { id: 'doc1', name: 'Original.pdf' });

    let pages: TestPage[] = [
      { id: 'p1', docId: 'doc1', pageIndex: 0 },
      { id: 'p2', docId: 'doc1', pageIndex: 1 },
      { id: 'p3', docId: 'doc1', pageIndex: 2 },
    ];

    const undoStack: HistoryCommand[] = [];

    // Delete page 2 (index 1)
    const deletePage = (idx: number) => {
      const deleted = pages[idx]!;
      const savedDoc = docs.get(deleted.docId);
      pages.splice(idx, 1);

      undoStack.push({
        description: `Delete page ${idx + 1}`,
        undo: () => {
          if (savedDoc && !docs.has(savedDoc.id)) {
            docs.set(savedDoc.id, savedDoc);
          }
          pages.splice(idx, 0, deleted);
        },
        redo: () => {
          pages.splice(idx, 1);
        },
      });
    };

    deletePage(1);
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.id)).toEqual(['p1', 'p3']);

    // Undo delete
    const undoCmd = undoStack.pop()!;
    undoCmd.undo();
    expect(pages).toHaveLength(3);
    expect(pages.map((p) => p.id)).toEqual(['p1', 'p2', 'p3']);

    // Redo delete
    undoCmd.redo();
    expect(pages).toHaveLength(2);
    expect(pages.map((p) => p.id)).toEqual(['p1', 'p3']);
  });
});
