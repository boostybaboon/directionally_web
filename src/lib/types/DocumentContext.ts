/** This needs to be replaced by svelte 5 reactivity
 *  This is a direct solution to get the document context working,
 *  to get a callback when the document reference changes
 */


import type { Production } from '$core/interfaces/Production';

export type DocumentObserver = {
  onDocumentChanged: (document: Production | null) => void;
};

export type DocumentContext = {
  currentDocument: Production | null;
  createDocument: () => void;
  openDocument: () => void;
  registerObserver: (observer: DocumentObserver) => () => void;
}; 