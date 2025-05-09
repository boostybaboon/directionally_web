import type { CommandExecutor } from './CommandExecutor';
import type { SceneChanger } from './SceneChanger';
import type { SceneViewer } from './SceneViewer';

export interface DocumentInterfaces {
  commandExecutor: CommandExecutor;
  sceneChanger: SceneChanger;
  sceneViewer: SceneViewer;
} 