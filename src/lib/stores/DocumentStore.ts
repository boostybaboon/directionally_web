import { writable, derived } from 'svelte/store';
import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';
import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';

interface ActiveDocument {
    id: string | null;
    scene: SceneViewer & CommandExecutor | null;
    name: string;
    isModified: boolean;
}

interface DocumentState {
    documents: Map<string, DocumentInterfaces>;
    activeDocument: ActiveDocument;
}

const initialState: DocumentState = {
    documents: new Map(),
    activeDocument: {
        id: null,
        scene: null,
        name: 'Untitled',
        isModified: false
    }
};

function createDocumentStore() {
    const store = writable<DocumentState>(initialState);
    const { subscribe, set, update } = store;

    // Create derived stores
    const activeDocument = derived(store, $store => $store.activeDocument);
    const activeScene = derived(store, $store => $store.activeDocument.scene);

    return {
        subscribe,
        
        // Document collection management
        addDocument: (document: DocumentInterfaces) => {
            const id = crypto.randomUUID();
            update(state => {
                const newDocuments = new Map(state.documents);
                newDocuments.set(id, document);
                return {
                    documents: newDocuments,
                    activeDocument: {
                        id,
                        scene: document.sceneViewer as SceneViewer & CommandExecutor,
                        name: 'Untitled',
                        isModified: false
                    }
                };
            });
            return id;
        },

        removeDocument: (id: string) => {
            update(state => {
                const newDocuments = new Map(state.documents);
                newDocuments.delete(id);
                const newActiveDocument = state.activeDocument.id === id 
                    ? initialState.activeDocument 
                    : state.activeDocument;
                return {
                    documents: newDocuments,
                    activeDocument: newActiveDocument
                };
            });
        },

        // Active document management
        setActiveDocument: (id: string) => {
            update(state => {
                const document = state.documents.get(id);
                if (!document) return state;
                
                return {
                    ...state,
                    activeDocument: {
                        id,
                        scene: document.sceneViewer as SceneViewer & CommandExecutor,
                        name: 'Untitled', // TODO: Get name from document
                        isModified: false
                    }
                };
            });
        },

        // Document state management
        markAsModified: () => {
            update(state => ({
                ...state,
                activeDocument: {
                    ...state.activeDocument,
                    isModified: true
                }
            }));
        },

        saveDocument: () => {
            update(state => ({
                ...state,
                activeDocument: {
                    ...state.activeDocument,
                    isModified: false
                }
            }));
            return true;
        },

        // Getters
        getDocument: (id: string) => {
            let result: DocumentInterfaces | undefined;
            subscribe(state => {
                result = state.documents.get(id);
            })();
            return result;
        },

        // Expose derived stores
        activeDocument,
        activeScene
    };
}

export const documentStore = createDocumentStore(); 
