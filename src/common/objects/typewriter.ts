import { Scene } from 'common/scene';
import { scaled } from 'common/utils/scaled';
import { Animation, Font } from 'constants';

export class Typewriter extends Phaser.GameObjects.Container {
  private textObjects: (Phaser.GameObjects.BitmapText | Phaser.GameObjects.Sprite)[] = [];

  private textWidth = 0;

  private textHeight = 0;

  private typeFrom = 0;

  constructor(
    public scene: Scene,
    private font: string = Font.DefaultWhite,
    private fontHeight: number = 7,
    private fontSize: number = 14,
    private lineHeight: number = 2,
    private characterAnimationDuration: number = 250,
    private characterAnimationDelay: number = 30,
    private characterAnimationOffset: number = 1.5
  ) {
    super(scene);
  }

  public setText(text: string, typeFrom: number = 0): Typewriter {
    this.textObjects.forEach((to) => to.destroy());
    this.textWidth = 0;
    this.textHeight = scaled(-12);
    this.typeFrom = typeFrom;

    this.textObjects = [];
    const chars = text.split('');
    for (let index = 0; index < chars.length; index++) {
      const c = chars[index];

      if (c !== '[') {
        const text = this.scene.add
          .bitmapText(this.textWidth, this.textHeight, this.font, c)
          .setAlpha(index >= typeFrom ? 0 : 1)
          .setScale(this.fontSize / this.fontHeight);

        text.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.textWidth += text.width;

        if (c === '\n') {
          this.textHeight += scaled(this.fontSize * this.lineHeight);
          this.textWidth = 0;
        }

        this.add(text);

        this.textObjects.push(text);
      } else {
        const sprite = (text.substring(index, text.length).match('([^\\]]*)') ?? [])[0] ?? '';
        const [type, key] = sprite.replace('[', '').replace(']', '').split(':');

        const obj = this.scene.add
          .sprite(this.textWidth, this.textHeight, key)
          .setOrigin(0, 0)
          .setAlpha(index >= typeFrom ? 0 : 1);

        const actualKey = Object.values(Animation).find((animation) => animation === key);

        if (type === 'animation' && actualKey) {
          obj.anims.play(actualKey);
        }

        obj.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        obj.setScale((this.fontSize / obj.height) * 2);

        this.textWidth += obj.displayWidth;

        this.add(obj);

        this.textObjects.push(obj);

        index += sprite.length;
      }
    }

    return this;
  }

  public play(): Typewriter {
    this.textObjects.forEach((o, index) => {
      if (index < this.typeFrom) return;

      this.scene.tweens.add({
        targets: o,
        duration: this.characterAnimationDuration,
        delay: (index - this.typeFrom) * this.characterAnimationDelay,
        props: {
          y: {
            ease: 'Back.Out',
            to: o.y,
            from: o.y + scaled(this.fontSize * this.characterAnimationOffset),
          },
          alpha: {
            ease: 'Quadratic.In',
            to: 1,
            from: 0,
          },
        },
      });
    });

    return this;
  }

  public write(text: string, from: number = 0): Typewriter {
    return this.setText(text, from).play();
  }

  public writeDuration(): number {
    return (
      (this.textObjects.length - 1 - this.typeFrom) * this.characterAnimationDelay + this.characterAnimationDuration
    );
  }

  public writeWidth(): number {
    const left = this.textObjects.map((o) => o.x).sort((a, b) => a - b)[0] ?? 0;

    const right =
      this.textObjects
        .map((o) => o.x + o.w)
        .sort((a, b) => a - b)
        .reverse()[0] ?? 0;

    return right - left;
  }
}
