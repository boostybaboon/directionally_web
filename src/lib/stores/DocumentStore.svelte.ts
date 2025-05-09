import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

// The main document state
let document = $state<DocumentInterfaces | null>(null);

// Actions
export function setDocument(newDocument: DocumentInterfaces) {
    document = newDocument;
}

export function clearDocument() {
    document = null;
}

// Export functions to access the state
export function getDocument(): DocumentInterfaces | null {
    return document;
} 