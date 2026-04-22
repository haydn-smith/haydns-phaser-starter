import { Typewriter } from 'common/objects/typewriter';
import { Scene } from 'common/scene';
import { ANIMATION, DEPTH, FONT, SPRITE } from 'constants';

export class TypewriterExample extends Scene {
  constructor() {
    super(`Typewriter Example`);
  }

  create() {
    const graphics = this.add.graphics();

    graphics.fillStyle(0xbbbbbb, 1).fillRect(0, 0, this.width(), this.height());

    this.add
      .existing(
        new Typewriter(this, {
          font: FONT.SourGummyBlack,
          // This bitmap font is 32px high.
          fontHeight: 32,
          fontSize: 48,
        })
      )
      .setDepth(DEPTH.UI)
      .setScrollFactor(0)
      .write(`This is a test.`)
      .setPosition(20, 100);

    this.add
      .existing(
        new Typewriter(this, {
          font: FONT.MonogramBlack,
          // This bitmap font is 7px high.
          fontHeight: 7,
          fontSize: 48,
          characterAnimationDuration: 500,
        })
      )
      .setInterpolation(Phaser.Textures.FilterMode.NEAREST)
      .setDepth(DEPTH.UI)
      .setScrollFactor(0)
      .write(`This is a test.`)
      .setPosition(20, 200);

    this.add
      .existing(
        new Typewriter(this, {
          font: FONT.MonogramWhite,
          // This bitmap font is 7px high.
          fontHeight: 7,
          fontSize: 64,
          characterAnimationDelay: 100,
        })
      )
      .setInterpolation(Phaser.Textures.FilterMode.NEAREST)
      .setDepth(DEPTH.UI)
      .setScrollFactor(0)
      .write(`This is a test.`)
      .setPosition(20, 300);

    this.add
      .existing(
        new Typewriter(this, {
          font: FONT.SourGummyBlack,
          // This bitmap font is 32px high.
          fontHeight: 32,
          fontSize: 16,
        })
      )
      .setDepth(DEPTH.UI)
      .setScrollFactor(0)
      .write(`This is a\nmultiline test.\nHere is another one!`)
      .setPosition(20, 450);

    this.add
      .existing(
        new Typewriter(this, {
          font: FONT.SourGummyBlack,
          // This bitmap font is 32px high.
          fontHeight: 32,
          fontSize: 32,
        })
      )
      .setDepth(DEPTH.UI)
      .setScrollFactor(0)
      .write(`This one has [sprite:${SPRITE.ZButton}] an animation [animation:${ANIMATION.ZButton}] in it.`)
      .setPosition(20, 600);
  }
}
