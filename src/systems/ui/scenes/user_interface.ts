import { debugDepth, isDebug } from 'systems/flags';
import { sceneKey } from 'systems/ui/constants';
import { Fader } from 'systems/ui/objects/fader';
import { Letterbox } from 'systems/ui/objects/letter_box';

export class UserInterface extends Phaser.Scene {
  private graphics: Phaser.GameObjects.Graphics;

  private letterbox: Letterbox;

  private fader: Fader;

  private debugText: Phaser.GameObjects.BitmapText;

  private debugTextContent: Partial<Record<string, string>> = {};

  constructor(
    private depth: number = 9000,
    private debugFont: string = ''
  ) {
    super(sceneKey);
  }

  public init(data: object) {
    this.depth = 'depth' in data && typeof data.depth === 'number' ? data.depth : 9000;
    this.debugFont = 'debugFont' in data && typeof data.debugFont === 'string' ? data.debugFont : '';
  }

  public create() {
    this.fader = this.add.existing(new Fader(this).setDepth(this.depth));

    this.letterbox = this.add.existing(new Letterbox(this).setDepth(this.depth));

    this.debugText = this.add.bitmapText(4, 0, this.debugFont, '', 16).setDepth(debugDepth());

    this.graphics = this.add.graphics();
  }

  public getFader(): Fader {
    return this.fader;
  }

  public getLetterbox(): Letterbox {
    return this.letterbox;
  }

  public update(time: number, delta: number) {
    if (isDebug()) {
      // @ts-expect-error invalid type declaration.
      this.setDebugText('number of sounds', this.sound.getAll().length);
      this.setDebugText('time', time.toFixed(2));
      this.setDebugText('delta', delta.toFixed(2));

      this.debugText.setText(Object.entries(this.debugTextContent).map(([k, v]) => k + ': ' + v));

      this.debugTextContent = {};

      this.graphics
        .setDepth(debugDepth())
        .clear()
        .lineStyle(2, 0xff0000, 1)
        .strokeRect(0, 0, this.renderer.width, this.renderer.height);
    }

    this.scene.bringToTop(sceneKey);
  }

  public setDebugText(key: string, value: string): UserInterface {
    this.debugTextContent[key] = value;

    return this;
  }
}
