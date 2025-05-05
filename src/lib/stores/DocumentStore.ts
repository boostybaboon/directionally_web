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

export class DocumentService {
  private state = $state(initialState);

  // Getters
  get scene() { return this.state.scene; }
  get isModified() { return this.state.isModified; }
  get name() { return this.state.name; }

  // Interface-specific getters
  get sceneViewer() { return this.state.scene as SceneViewer | null; }
  get commandExecutor() { return this.state.scene as CommandExecutor | null; }
  get sceneChanger() { return this.state.scene as SceneChanger | null; }

  // Document management functions
  createEmptyScene(scene: Scene) {
    this.state = {
      ...this.state,
      scene,
      isModified: false,
      name: 'Untitled'
    };
  }

  openScene(scene: Scene, name: string) {
    this.state = {
      ...this.state,
      scene,
      isModified: false,
      name
    };
  }

  saveScene() {
    this.state = {
      ...this.state,
      isModified: false
    };
    return true;
  }

  closeScene() {
    this.state = initialState;
  }

  markAsModified() {
    this.state = {
      ...this.state,
      isModified: true
    };
  }
}

// Create a singleton instance
export const documentService = new DocumentService();