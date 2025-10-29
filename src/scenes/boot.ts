import { logEvent } from 'common/utils/log';
import { Scene } from 'constants';

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Load any assets we need for the loading screen here.
  }

  create() {
    logEvent('Creating "Boot" scene.');

    this.scene.start(Scene.Preloader);
  }
}
