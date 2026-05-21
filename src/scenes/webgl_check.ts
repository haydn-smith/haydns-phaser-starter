import { Scene } from 'common/scene';
import { logEvent, logWarn } from 'common/utils/log';
import { FONT, SCENE } from 'constants';

export class WebglCheck extends Scene {
  constructor() {
    super(SCENE.WebglCheck);
  }

  create() {
    if (this.app().renderer.type === Phaser.WEBGL) {
      logEvent('WebGL detected - starting game.');

      // Start the game here.
      // this.scene.start(SCENE.MainMenu);
    } else {
      logWarn('WebGL is not supported!');

      const text = this.add
        .bitmapText(50, 50, FONT.MonogramWhite, 'This game is not supported by your browser.')
        .setScale(3);
      text.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

      const text2 = this.add
        .bitmapText(
          50,
          125,
          FONT.MonogramWhite,
          "You will need to enable WebGL in your browser's settings, or install\na new one."
        )
        .setScale(3);
      text2.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

      const text3 = this.add
        .bitmapText(50, 250, FONT.MonogramWhite, 'Common options include Google Chrome and Mozilla Firefox :)')
        .setScale(3);
      text3.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }
  }
}
