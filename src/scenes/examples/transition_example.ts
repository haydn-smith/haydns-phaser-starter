import { Scene } from 'common/scene';
import { FONT } from 'constants';

export class TransitionExample extends Scene {
  private count = 0;

  constructor() {
    super('Transition Example');
  }

  init(data: any) {
    this.count = data?.count ?? 0;
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xbbbbbb, 1).fillRect(0, 0, this.width(), this.height());

    const text = this.add.bitmapText(100, 100, FONT.MonogramBlack, this.count.toString(), 128, 0.5);
    text.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.input.keyboard?.on('keydown-Q', () => {
      this.transition().run(() => this.scene.start('Transition Example', { count: this.count + 1 }));
    });
  }
}
