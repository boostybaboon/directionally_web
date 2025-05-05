import type { Scene } from '$lib/core/Scene';
import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';
import type { SceneChanger } from '$lib/core/interfaces/SceneChanger';
import { writable } from 'svelte/store';

// Define the document state interface
export interface DocumentState {
  scene: Scene | null;
  isModified: boolean;
  name: string;
}

// Create the initial document state
const initialState: DocumentState = {
  scene: null,
  isModified: false,
  name: 'Untitled'
};

// Create the store
const store = writable<DocumentState>(initialState);

// Export the store interface
export const documentService = {
  subscribe: store.subscribe,
  // Getters
  get scene() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.scene;
  },
  get isModified() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.isModified;
  },
  get name() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.name;
  },

  // Interface-specific getters
  get sceneViewer() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.scene as SceneViewer | null;
  },
  get commandExecutor() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.scene as CommandExecutor | null;
  },
  get sceneChanger() { 
    let state: DocumentState;
    store.subscribe(s => state = s)();
    return state.scene as SceneChanger | null;
  },

  // Document management functions
  createEmptyScene(scene: Scene) {
    store.update(state => ({
      ...state,
      scene,
      isModified: false,
      name: 'Untitled'
    }));
  },

  openScene(scene: Scene, name: string) {
    store.update(state => ({
      ...state,
      scene,
      isModified: false,
      name
    }));
  },

  saveScene() {
    store.update(state => ({
      ...state,
      isModified: false
    }));
    return true;
  },

  closeScene() {
    store.set(initialState);
  },

  markAsModified() {
    store.update(state => ({
      ...state,
      isModified: true
    }));
  }
}; 