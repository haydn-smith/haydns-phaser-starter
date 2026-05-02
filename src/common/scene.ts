import { SCENE } from 'constants';
import { SoundManager } from 'scenes/sound_manager';
import { Game } from './game';

export class Scene extends Phaser.Scene {
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  height() {
    return this.renderer.height;
  }

  width() {
    return this.renderer.width;
  }

  halfHeight() {
    return this.renderer.height / 2;
  }

  halfWidth() {
    return this.renderer.width / 2;
  }

  app() {
    return this.game as Game;
  }

  allChildren() {
    const traverse = (list: Phaser.GameObjects.GameObject[]): Phaser.GameObjects.GameObject[] => {
      return list.flatMap((o) => (o instanceof Phaser.GameObjects.Container ? [o, ...traverse(o.getAll())] : [o]));
    };

    return traverse([
      // Children on the display list...
      ...this.children.getAll(),
      // ...And children on the update list.
      ...this.sys.updateList.getActive(),
    ]);
  }

  soundManager() {
    return this.scene.get<SoundManager>(SCENE.SoundManager);
  }
}
