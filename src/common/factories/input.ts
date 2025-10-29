import { Action } from 'constants';
import { GamepadButton, input } from 'systems/input';

export const allInputs = (scene: Phaser.Scene) => {
  return input(scene)
    .addKeyboardInput(Action.Action, Phaser.Input.Keyboard.KeyCodes.Z)
    .addGamepadInput(Action.Action, GamepadButton.A)
    .addGamepadInput(Action.Action, GamepadButton.B)
    .addKeyboardInput(Action.Up, Phaser.Input.Keyboard.KeyCodes.UP)
    .addKeyboardInput(Action.Up, Phaser.Input.Keyboard.KeyCodes.W)
    .addGamepadInput(Action.Up, GamepadButton.Up)
    .addGamepadInput(Action.Up, GamepadButton.StickLeftUp)
    .addKeyboardInput(Action.Down, Phaser.Input.Keyboard.KeyCodes.DOWN)
    .addKeyboardInput(Action.Down, Phaser.Input.Keyboard.KeyCodes.S)
    .addGamepadInput(Action.Down, GamepadButton.Down)
    .addGamepadInput(Action.Down, GamepadButton.StickLeftDown)
    .addKeyboardInput(Action.Left, Phaser.Input.Keyboard.KeyCodes.LEFT)
    .addKeyboardInput(Action.Left, Phaser.Input.Keyboard.KeyCodes.A)
    .addGamepadInput(Action.Left, GamepadButton.Left)
    .addGamepadInput(Action.Left, GamepadButton.StickLeftLeft)
    .addKeyboardInput(Action.Right, Phaser.Input.Keyboard.KeyCodes.RIGHT)
    .addKeyboardInput(Action.Right, Phaser.Input.Keyboard.KeyCodes.D)
    .addGamepadInput(Action.Right, GamepadButton.Right)
    .addGamepadInput(Action.Right, GamepadButton.StickLeftRight);
};

export const actionInput = (scene: Phaser.Scene) => {
  return input(scene)
    .addKeyboardInput(Action.Action, Phaser.Input.Keyboard.KeyCodes.Z)
    .addGamepadInput(Action.Action, GamepadButton.A)
    .addGamepadInput(Action.Action, GamepadButton.B);
};

export const directionalInputs = (scene: Phaser.Scene) => {
  return input(scene)
    .addKeyboardInput(Action.Up, Phaser.Input.Keyboard.KeyCodes.UP)
    .addKeyboardInput(Action.Up, Phaser.Input.Keyboard.KeyCodes.W)
    .addGamepadInput(Action.Up, GamepadButton.Up)
    .addGamepadInput(Action.Up, GamepadButton.StickLeftUp)
    .addKeyboardInput(Action.Down, Phaser.Input.Keyboard.KeyCodes.DOWN)
    .addKeyboardInput(Action.Down, Phaser.Input.Keyboard.KeyCodes.S)
    .addGamepadInput(Action.Down, GamepadButton.Down)
    .addGamepadInput(Action.Down, GamepadButton.StickLeftDown)
    .addKeyboardInput(Action.Left, Phaser.Input.Keyboard.KeyCodes.LEFT)
    .addKeyboardInput(Action.Left, Phaser.Input.Keyboard.KeyCodes.A)
    .addGamepadInput(Action.Left, GamepadButton.Left)
    .addGamepadInput(Action.Left, GamepadButton.StickLeftLeft)
    .addKeyboardInput(Action.Right, Phaser.Input.Keyboard.KeyCodes.RIGHT)
    .addKeyboardInput(Action.Right, Phaser.Input.Keyboard.KeyCodes.D)
    .addGamepadInput(Action.Right, GamepadButton.Right)
    .addGamepadInput(Action.Right, GamepadButton.StickLeftRight);
};
