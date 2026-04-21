import { Game } from './game';

export class Scene extends Phaser.Scene {
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public height() {
    return this.renderer.height;
  }

  public width() {
    return this.renderer.width;
  }

  public app() {
    return this.game as Game;
  }
}
