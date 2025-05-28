/** This needs to be replaced by svelte 5 reactivity
 *  This is a direct solution to get the document context working,
 *  to get a callback when the document reference changes
 */


import type { DocumentInterfaces } from '$core/interfaces/DocumentInterfaces';

export type DocumentObserver = {
  onDocumentChanged: (document: DocumentInterfaces | null) => void;
};

export type DocumentContext = {
  currentDocument: DocumentInterfaces | null;
  createDocument: () => void;
  openDocument: () => void;
  registerObserver: (observer: DocumentObserver) => () => void;
}; 