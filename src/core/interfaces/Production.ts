import type { CommandExecutor } from './CommandExecutor';
import type { SceneChanger } from './SceneChanger';
import type { SceneViewer } from './SceneViewer';

export interface Production {
  commandExecutor: CommandExecutor;
  sceneChanger: SceneChanger;
  sceneViewer: SceneViewer;
}
