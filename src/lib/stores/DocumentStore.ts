import { writable } from 'svelte/store';
import type { DocumentInterfaces } from '$lib/core/interfaces/DocumentInterfaces';

interface DocumentState {
    documents: Map<string, DocumentInterfaces>;
    activeDocumentId: string | null;
}

function createDocumentStore() {
    const { subscribe, set, update } = writable<DocumentState>({
        documents: new Map(),
        activeDocumentId: null
    });

    return {
        subscribe,
        addDocument: (document: DocumentInterfaces) => {
            const id = crypto.randomUUID();
            update(state => {
                const newDocuments = new Map(state.documents);
                newDocuments.set(id, document);
                return {
                    documents: newDocuments,
                    activeDocumentId: id
                };
            });
            return id;
        },
        removeDocument: (id: string) => {
            update(state => {
                const newDocuments = new Map(state.documents);
                newDocuments.delete(id);
                return {
                    documents: newDocuments,
                    activeDocumentId: state.activeDocumentId === id ? null : state.activeDocumentId
                };
            });
        },
        setActiveDocument: (id: string) => {
            update(state => ({
                ...state,
                activeDocumentId: id
            }));
        },
        getDocument: (id: string) => {
            let result: DocumentInterfaces | undefined;
            subscribe(state => {
                result = state.documents.get(id);
            })();
            return result;
        }
    };
}

export const documentStore = createDocumentStore(); 