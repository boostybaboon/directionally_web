import { writable, derived } from 'svelte/store';
import type { Scene } from '$lib/core/Scene';
import type { SceneViewer } from '$lib/core/interfaces/SceneViewer';
import type { CommandExecutor } from '$lib/core/interfaces/CommandExecutor';
import type { SceneChanger } from '$lib/core/interfaces/SceneChanger';

// Define the document state interface
interface DocumentState {
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

// Create the writable store
const documentStore = writable<DocumentState>(initialState);

// Document management functions
function createEmptyScene(scene: Scene) {
  documentStore.update(state => ({
    ...state,
    scene,
    isModified: false,
    name: 'Untitled'
  }));
}

function openScene(scene: Scene, name: string) {
  documentStore.update(state => ({
    ...state,
    scene,
    isModified: false,
    name
  }));
}

function saveScene() {
  documentStore.update(state => ({
    ...state,
    isModified: false
  }));
  return true;
}

function closeScene() {
  documentStore.set(initialState);
}

function markAsModified() {
  documentStore.update(state => ({
    ...state,
    isModified: true
  }));
}

// Derived stores for specific interfaces
const sceneViewer = derived(
  documentStore,
  $documentStore => $documentStore.scene as SceneViewer | null
);

const commandExecutor = derived(
  documentStore,
  $documentStore => $documentStore.scene as CommandExecutor | null
);

const sceneChanger = derived(
  documentStore,
  $documentStore => $documentStore.scene as SceneChanger | null
);

// Export the store and functions
export const DocumentService = {
  // Store
  subscribe: documentStore.subscribe,
  
  // Interface-specific derived stores
  sceneViewer,
  commandExecutor,
  sceneChanger,
  
  // Actions
  createEmptyScene,
  openScene,
  saveScene,
  closeScene,
  markAsModified
};