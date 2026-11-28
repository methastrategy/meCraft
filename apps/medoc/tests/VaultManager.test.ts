import { describe, it, expect, beforeEach } from 'vitest';
import { VaultManager } from '../src/engines/VaultManager.js';

describe('meDoc Studio — VaultManager', () => {
  let vault: VaultManager;

  beforeEach(() => {
    vault = new VaultManager();
  });

  it('initializes with default starter documents', () => {
    const docs = vault.getDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(2);
    expect(docs.some(d => d.name.includes('Welcome'))).toBe(true);
  });

  it('retrieves active document reliably', () => {
    const active = vault.getActiveDocument();
    expect(active).toBeDefined();
    expect(active.id).toBeDefined();
    expect(active.content.length).toBeGreaterThan(0);
  });

  it('creates new document and makes it active', () => {
    const newDoc = vault.createDocument('ResearchNotes', '# Research\n\nContent');
    expect(newDoc.name).toBe('ResearchNotes.md');
    expect(vault.getActiveDocument().id).toBe(newDoc.id);
  });

  it('updates document content and marks it dirty', () => {
    const doc = vault.getActiveDocument();
    vault.updateDocumentContent(doc.id, '# Updated Title');
    const updated = vault.getActiveDocument();
    expect(updated.content).toBe('# Updated Title');
    expect(updated.isDirty).toBe(true);

    vault.markSaved(doc.id);
    expect(vault.getActiveDocument().isDirty).toBe(false);
  });

  it('renames document with automatic .md extension enforcement', () => {
    const doc = vault.getActiveDocument();
    vault.renameDocument(doc.id, 'NewName');
    expect(vault.getActiveDocument().name).toBe('NewName.md');
  });

  it('selects document by id', () => {
    const docs = vault.getDocuments();
    const target = docs[1];
    const selected = vault.selectDocument(target.id);
    expect(selected?.id).toBe(target.id);
    expect(vault.getActiveDocument().id).toBe(target.id);
  });

  it('deletes document and gracefully switches to remaining document', () => {
    const initialCount = vault.getDocuments().length;
    const docToDelete = vault.createDocument('To Delete.md', 'temp');
    expect(vault.getDocuments().length).toBe(initialCount + 1);

    const deleted = vault.deleteDocument(docToDelete.id);
    expect(deleted).toBe(true);
    expect(vault.getDocuments().length).toBe(initialCount);
    expect(vault.getActiveDocument().id).not.toBe(docToDelete.id);
  });

  it('creates official Thai documents from templates', () => {
    const memoDoc = vault.createDocumentFromTemplate('memo');
    expect(memoDoc.name).toBe('บันทึกข้อความ.md');
    expect(memoDoc.content).toContain('บันทึกข้อความ');
    expect(memoDoc.content).toContain('ส่วนราชการ:');

    const letterDoc = vault.createDocumentFromTemplate('letter');
    expect(letterDoc.name).toBe('หนังสือภายนอก.md');
    expect(letterDoc.content).toContain('ครุฑ');

    const meetingDoc = vault.createDocumentFromTemplate('meeting');
    expect(meetingDoc.name).toBe('รายงานการประชุม.md');
    expect(meetingDoc.content).toContain('รายงานการประชุม');
  });

  it('creates an autosave recovery snapshot on document edit and restores from it', () => {
    const doc = vault.getActiveDocument();
    vault.updateDocumentContent(doc.id, '# Unsaved Work That Crashed');
    
    const snapshot = vault.getRecoverySnapshot(doc.id);
    expect(snapshot).not.toBeNull();
    expect(snapshot?.content).toBe('# Unsaved Work That Crashed');
    expect(snapshot?.reason).toBe('autosave');

    // Simulate crash where document reverted to old content
    doc.content = '# Reverted Content';
    expect(vault.getActiveDocument().content).toBe('# Reverted Content');

    const restored = vault.restoreFromRecovery(doc.id);
    expect(restored).toBe(true);
    expect(vault.getActiveDocument().content).toBe('# Unsaved Work That Crashed');
  });

  it('creates a safe backup before risky operations', () => {
    const doc = vault.getActiveDocument();
    const backup = vault.backupDocument(doc.id);
    expect(backup).not.toBeNull();
    expect(backup?.name).toContain('.bak.md');
    expect(backup?.content).toBe(doc.content);

    const docs = vault.getDocuments();
    expect(docs.some(d => d.id === backup?.id)).toBe(true);
  });

  it('clears recovery snapshot cleanly on manual save', () => {
    const doc = vault.getActiveDocument();
    vault.updateDocumentContent(doc.id, '# Content to save');
    expect(vault.getRecoverySnapshot(doc.id)).not.toBeNull();

    vault.markSaved(doc.id);
    expect(vault.getRecoverySnapshot(doc.id)).toBeNull();
  });

  it('merges localStorage snapshots with in-memory snapshots in getAllRecoverySnapshots', () => {
    const doc = vault.getActiveDocument();
    vault.updateDocumentContent(doc.id, '# Doc Content');
    
    // Simulate another snapshot existing in localStorage from previous session
    const mockStorage: Record<string, string> = {};
    mockStorage['medoc_recovery_journal_v1'] = JSON.stringify({
      'doc-external': {
        id: 'rec-external',
        docId: 'doc-external',
        name: 'External.md',
        content: '# External Doc',
        timestamp: Date.now() - 5000,
        reason: 'autosave',
      },
    });

    const origWindow = globalThis.window;
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStorage[k] || null,
        setItem: (k: string, v: string) => { mockStorage[k] = v; },
        removeItem: (k: string) => { delete mockStorage[k]; },
        clear: () => {},
        key: () => null,
        length: 0,
      } as Storage,
    };

    try {
      const all = vault.getAllRecoverySnapshots();
      expect(all.length).toBeGreaterThanOrEqual(2);
      expect(all.some(s => s.docId === 'doc-external')).toBe(true);
      expect(all.some(s => s.docId === doc.id)).toBe(true);
    } finally {
      globalThis.window = origWindow;
    }
  });

  it('restores recovery snapshot even when the original document was deleted', () => {
    const tempDoc = vault.createDocument('Ephemeral.md', '# Ephemeral data');
    vault.updateDocumentContent(tempDoc.id, '# Modified ephemeral');
    expect(vault.getRecoverySnapshot(tempDoc.id)).not.toBeNull();

    // Re-add snapshot to memory journal before delete simulating recovery point
    const snapshot = vault.getRecoverySnapshot(tempDoc.id)!;

    // Delete the document
    vault.deleteDocument(tempDoc.id);
    expect(vault.getDocuments().some(d => d.id === tempDoc.id)).toBe(false);

    // Save snapshot manually to recovery journal
    vault.saveRecoverySnapshot(tempDoc.id, snapshot.content, 'pre-import');

    const restored = vault.restoreFromRecovery(tempDoc.id);
    expect(restored).toBe(true);
    expect(vault.getDocuments().some(d => d.id === tempDoc.id)).toBe(true);
    expect(vault.getActiveDocument().content).toBe('# Modified ephemeral');
  });

  it('recovers documents from stage key if main docs storage is corrupted or missing', () => {
    const stagedDocs = [
      { id: 'staged-1', name: 'Staged Doc.md', content: '# Staged content', lastModified: 12345, isDirty: false },
    ];
    const mockStore: Record<string, string> = {
      'medoc_vault_documents__stage': JSON.stringify(stagedDocs),
    };

    const origWindow = globalThis.window;
    (globalThis as any).window = {
      localStorage: {
        getItem: (k: string) => mockStore[k] || null,
        setItem: (k: string, v: string) => { mockStore[k] = v; },
        removeItem: (k: string) => { delete mockStore[k]; },
        clear: () => {},
        key: () => null,
        length: 0,
      } as Storage,
    };

    try {
      const recoveredVault = new VaultManager();
      const docs = recoveredVault.getDocuments();
      expect(docs.some(d => d.id === 'staged-1')).toBe(true);
      expect(recoveredVault.getActiveDocument().content).toBe('# Staged content');
    } finally {
      globalThis.window = origWindow;
    }
  });

  it('returns recent documents ordered by lastModified descending', () => {
    const recents = vault.getRecentDocuments(5);
    expect(recents.length).toBeGreaterThan(0);
    for (let i = 0; i < recents.length - 1; i++) {
      expect(recents[i].lastModified).toBeGreaterThanOrEqual(recents[i + 1].lastModified);
    }
  });
});
