import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

export type DocumentObserver = {
  onDocumentChanged: (document: DocumentInterfaces | null) => void;
};

export type DocumentContext = {
  currentDocument: DocumentInterfaces | null;
  createDocument: () => void;
  openDocument: () => void;
  registerObserver: (observer: DocumentObserver) => () => void;
}; 