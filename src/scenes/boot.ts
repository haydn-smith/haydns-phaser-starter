import { Scene } from 'common/scene';
import { SCENE } from 'constants';

export class Boot extends Scene {
  constructor() {
    super(SCENE.Boot);
  }

  preload() {
    // Load any assets we need for the loading screen here.
  }

  create() {
    this.scene.start(SCENE.Preloader);
  }
}
