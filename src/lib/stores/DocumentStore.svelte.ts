import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

// Document state
let currentDocument = $state<DocumentInterfaces | null>(null);

// Event state
let documentCreated = $state<DocumentInterfaces | null>(null);
let documentOpened = $state<DocumentInterfaces | null>(null);
let documentSaved = $state<DocumentInterfaces | null>(null);

// Document state management
export function getDocument(): DocumentInterfaces | null {
  return currentDocument;
}

export function setDocument(document: DocumentInterfaces) {
  currentDocument = document;
}

// Document event management
export function createDocument(document: DocumentInterfaces) {
  currentDocument = document;
  documentCreated = document;
}

export function openDocument(document: DocumentInterfaces) {
  currentDocument = document;
  documentOpened = document;
}

export function saveDocument() {
  if (currentDocument) {
    documentSaved = currentDocument;
  }
}

// Event subscriptions
export function onDocumentCreated(callback: (document: DocumentInterfaces) => void) {
  $effect(() => {
    if (documentCreated) {
      callback(documentCreated);
      documentCreated = null; // Reset after handling
    }
  });
}

export function onDocumentOpened(callback: (document: DocumentInterfaces) => void) {
  $effect(() => {
    if (documentOpened) {
      callback(documentOpened);
      documentOpened = null; // Reset after handling
    }
  });
}

export function onDocumentSaved(callback: (document: DocumentInterfaces) => void) {
  $effect(() => {
    if (documentSaved) {
      callback(documentSaved);
      documentSaved = null; // Reset after handling
    }
  });
}

// Document state subscriptions
export function onDocumentChange(callback: (document: DocumentInterfaces | null) => void) {
  $effect(() => {
    callback(currentDocument);
  });
}
 