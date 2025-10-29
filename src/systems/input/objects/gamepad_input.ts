import {
  Gamepad,
  GamepadButton,
  GamepadStick,
  GamepadStickAxis,
  TypeOfGamepad,
  TypeOfGamepadButton,
  TypeOfGamepadStick,
} from 'systems/input/constants';
import { Inputtable } from 'systems/input/contracts/inputtable';

export class GamepadInput extends Phaser.GameObjects.GameObject implements Inputtable {
  private justPressed: boolean = false;

  private justPressedHasBeenFired: boolean = false;

  constructor(
    scene: Phaser.Scene,
    private button: TypeOfGamepadButton,
    private pad: TypeOfGamepad = Gamepad.One
  ) {
    super(scene, 'Gamepad Input');
  }

  public isPressed(): number {
    const gamepad = this.getGamepad(this.pad);

    if (!gamepad) {
      return 0;
    }

    if (this.button === GamepadButton.L1) {
      return gamepad.L1;
    } else if (this.button === GamepadButton.R1) {
      return gamepad.R1;
    } else if (this.button === GamepadButton.L2) {
      return gamepad.L2;
    } else if (this.button === GamepadButton.R2) {
      return gamepad.R2;
    } else if (this.button === GamepadButton.StickLeftUp) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Left);
      return vec.y >= 0 ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.StickLeftDown) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Left);
      return vec.y <= 0 ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.StickLeftLeft) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Left);
      return vec.x >= 0 ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.StickLeftRight) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Left);
      return vec.x <= 0 ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.StickRightUp) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Right);
      return vec.y >= 0 ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.StickRightDown) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Right);
      return vec.y <= 0 ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.StickRightLeft) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Right);
      return vec.x >= 0 ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.StickRightRight) {
      const vec = this.getGamepadStickVector(this.pad, GamepadStick.Right);
      return vec.x <= 0 ? 0 : Math.abs(vec.x);
    } else {
      return gamepad.isButtonDown(this.button) ? 1 : 0;
    }
  }

  public isJustPressed(): boolean {
    return this.justPressed;
  }

  public preUpdate() {
    if (this.isPressed() && !this.justPressed && !this.justPressedHasBeenFired) {
      this.justPressed = true;
      this.justPressedHasBeenFired = true;
    } else {
      this.justPressed = false;
    }

    if (!this.isPressed()) {
      this.justPressedHasBeenFired = false;
    }
  }

  private getGamepadStickVector(pad: TypeOfGamepad, stick: TypeOfGamepadStick): { x: number; y: number } {
    const gamepad = this.getGamepad(pad);

    const vector = {
      x: 0,
      y: 0,
    };

    if (gamepad !== undefined && stick === GamepadStick.Left) {
      vector.x = gamepad.getAxisValue(GamepadStickAxis.LeftX);
      vector.y = gamepad.getAxisValue(GamepadStickAxis.LeftY);
    } else if (gamepad !== undefined && stick === GamepadStick.Right) {
      vector.x = gamepad.getAxisValue(GamepadStickAxis.RightY);
      vector.y = gamepad.getAxisValue(GamepadStickAxis.RightY);
    }

    return vector;
  }

  private getGamepad(pad: TypeOfGamepad): Phaser.Input.Gamepad.Gamepad | undefined {
    if (pad === Gamepad.One) {
      return this.scene.input.gamepad?.pad1;
    } else if (pad === Gamepad.Two) {
      return this.scene.input.gamepad?.pad2;
    } else if (pad === Gamepad.Three) {
      return this.scene.input.gamepad?.pad3;
    } else if (pad === Gamepad.Four) {
      return this.scene.input.gamepad?.pad4;
    }

    return this.scene.input.gamepad?.pad1;
  }
}
