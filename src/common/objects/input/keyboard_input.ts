import { Inputtable } from 'common/contracts/inputtable';
import { Scene } from 'common/scene';

export type TypeOfKeyCode = (typeof Phaser.Input.Keyboard.KeyCodes)[keyof typeof Phaser.Input.Keyboard.KeyCodes];

export class KeyboardInput extends Phaser.GameObjects.GameObject implements Inputtable {
  private key?: Phaser.Input.Keyboard.Key;

  private justPressed = false;

  private justPressedHasBeenFired = false;

  constructor(
    public scene: Scene,
    key: TypeOfKeyCode
  ) {
    super(scene, 'Keyboard Input');

    this.setName(String(key));

    if (scene.input.keyboard) {
      this.key = this.scene.app().registerKeyboardKey(scene.input.keyboard, Number(key));
    }
  }

  isPressed() {
    return this.key?.isDown ? 1 : 0;
  }

  isJustPressed() {
    return this.justPressed;
  }

  preUpdate() {
    if (this.key?.isDown && !this.justPressed && !this.justPressedHasBeenFired) {
      this.justPressed = true;
      this.justPressedHasBeenFired = true;
    } else {
      this.justPressed = false;
    }

    if (this.key?.isUp) {
      this.justPressedHasBeenFired = false;
    }
  }
}
