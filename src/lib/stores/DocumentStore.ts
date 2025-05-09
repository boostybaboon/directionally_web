import { writable, derived } from 'svelte/store';
import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

function createDocumentStore() {
    const store = writable<DocumentInterfaces | null>(null);
    const { subscribe, set, update } = store;

    // Create derived store for the scene
    const activeScene = derived(store, $store => $store?.sceneViewer ?? null);

    return {
        subscribe,
        
        // Document management
        setDocument: (document: DocumentInterfaces) => {
            set(document);
        },

        clearDocument: () => {
            set(null);
        },

        // Document state management
        markAsModified: () => {
            update(doc => {
                if (doc) {
                    // TODO: Add isModified to DocumentInterfaces if needed
                    return doc;
                }
                return null;
            });
        },

        // Expose derived store
        activeScene
    };
}

export const documentStore = createDocumentStore(); 
