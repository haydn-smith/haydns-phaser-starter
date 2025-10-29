import { sceneKey } from 'systems/ui/constants';
import { UserInterface } from 'systems/ui/scenes/user_interface';

export function startUI(
  scene: Phaser.Scene,
  {
    depth = 9000,
    debugFont = '',
  }: {
    depth: number;
    debugFont: string;
  }
): void {
  scene.scene.add(sceneKey, UserInterface, true, {
    depth,
    debugFont,
  });
}
