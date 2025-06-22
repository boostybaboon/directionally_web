import type { CommandExecutor } from './CommandExecutor';
import type { SceneChanger } from './SceneChanger';
import type { SceneViewer } from './SceneViewer';
import type { SceneSelector } from './SceneSelector';
import type { AnimationManager } from './AnimationManager';

export interface Production {
    commandExecutor: CommandExecutor;
    sceneChanger: SceneChanger;
    sceneViewer: SceneViewer;
    sceneSelector: SceneSelector;
    readonly animationManager: AnimationManager;
}
