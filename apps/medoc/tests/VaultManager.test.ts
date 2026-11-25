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
});
