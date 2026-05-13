import { Scene } from 'common/scene';
import { logDebug } from 'common/utils/log';
import { FONT } from 'constants';

export class SaveExample extends Scene {
  private text: Phaser.GameObjects.BitmapText;

  constructor() {
    super('Save Example');
  }

  create() {
    this.input.keyboard?.on('keydown-A', () => {
      // Load game.
      this.app().load();

      logDebug('Persisted data:', this.app().data());
    });

    this.input.keyboard?.on('keydown-S', () => {
      // Save game.
      this.app().save();

      logDebug('Persisted data:', this.app().data());
    });

    this.text = this.add.bitmapText(50, 50, FONT.MonogramWhite, '').setScale(5);
    this.text.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }

  update(_: number, delta: number) {
    this.app()
      .data()
      .addPlaytime(delta * 0.001);

    this.text.setText(this.app().data().getPlaytime().toFixed(2));
  }
}
