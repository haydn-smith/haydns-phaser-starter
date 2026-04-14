import { Inputtable } from 'common/contracts/inputtable';

export const Gamepad = {
  One: 'One',
  Two: 'Two',
  Three: 'Three',
  Four: 'Four',
} as const;
export type KeyOfGamepad = keyof typeof Gamepad;
export type TypeOfGamepad = (typeof Gamepad)[KeyOfGamepad];

export const GamepadButton = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  L1: 4,
  R1: 5,
  L2: 6,
  R2: 7,
  Select: 8,
  Start: 9,
  StickLeft: 10,
  StickRight: 11,
  Up: 12,
  Down: 13,
  Left: 14,
  Right: 15,
  Vendor1: 16, // The 'PS Button' or 'Xbox Home' button.
  Vendor2: 17, // The Dualshock's touch panel thing.
  StickLeftUp: 18,
  StickLeftDown: 19,
  StickLeftLeft: 20,
  StickLeftRight: 21,
  StickRightUp: 22,
  StickRightDown: 23,
  StickRightLeft: 24,
  StickRightRight: 25,
} as const;
export type KeyOfGamepadButton = keyof typeof GamepadButton;
export type TypeOfGamepadButton = (typeof GamepadButton)[KeyOfGamepadButton];

export const GamepadStick = {
  Left: 'Left',
  Right: 'Right',
} as const;
export type KeyOfGamepadStick = keyof typeof GamepadStick;
export type TypeOfGamepadStick = (typeof GamepadStick)[KeyOfGamepadStick];

export const GamepadStickAxis = {
  LeftX: 0,
  LeftY: 1,
  RightX: 2,
  RightY: 3,
} as const;
export type KeyOfGamepadStickAxis = keyof typeof GamepadStickAxis;
export type TypeOfGamepadStickAxis = (typeof GamepadStickAxis)[KeyOfGamepadStickAxis];

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
