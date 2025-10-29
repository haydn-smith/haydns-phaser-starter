import { Inputtable } from 'systems/input/contracts/inputtable';

export class KeyboardInput extends Phaser.GameObjects.GameObject implements Inputtable {
  private key?: Phaser.Input.Keyboard.Key;

  private justPressed: boolean = false;

  private justPressedHasBeenFired: boolean = false;

  constructor(scene: Phaser.Scene, key: string | number) {
    super(scene, 'Keyboard Input');

    this.key = this.scene.input.keyboard?.addKey(key);
  }

  public isPressed(): number {
    return this.key?.isDown ? 1 : 0;
  }

  public isJustPressed(): boolean {
    return this.justPressed;
  }

  public preUpdate() {
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
