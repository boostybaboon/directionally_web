import type { CommandExecutor } from './CommandExecutor';
import type { SceneChanger } from './SceneChanger';
import type { SceneViewer } from './SceneViewer';

export interface DocumentInterfaces {
  commandExecutor: CommandExecutor;
  sceneChanger: SceneChanger;
  sceneViewer: SceneViewer;
}

export interface DocumentObserver {
  onDocumentChanged: (document: DocumentInterfaces | null) => void;
}

export interface DocumentContext {
  currentDocument: DocumentInterfaces | null;
  createDocument: () => void;
  openDocument: () => void;
  registerObserver: (observer: DocumentObserver) => () => void;
} 