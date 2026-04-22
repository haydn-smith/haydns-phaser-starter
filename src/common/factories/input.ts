import { GamepadButton } from 'common/objects/input/gamepad_input';
import { Input } from 'common/objects/input/input';
import { Scene } from 'common/scene';
import { ACTION } from 'constants';

export const allInputs = (scene: Scene) => {
  return new Input(scene)
    .addKeyboardInput(ACTION.Action, Phaser.Input.Keyboard.KeyCodes.Z)
    .addGamepadInput(ACTION.Action, GamepadButton.A)
    .addGamepadInput(ACTION.Action, GamepadButton.B)
    .addKeyboardInput(ACTION.Up, Phaser.Input.Keyboard.KeyCodes.UP)
    .addKeyboardInput(ACTION.Up, Phaser.Input.Keyboard.KeyCodes.W)
    .addGamepadInput(ACTION.Up, GamepadButton.Up)
    .addGamepadInput(ACTION.Up, GamepadButton.StickLeftUp)
    .addKeyboardInput(ACTION.Down, Phaser.Input.Keyboard.KeyCodes.DOWN)
    .addKeyboardInput(ACTION.Down, Phaser.Input.Keyboard.KeyCodes.S)
    .addGamepadInput(ACTION.Down, GamepadButton.Down)
    .addGamepadInput(ACTION.Down, GamepadButton.StickLeftDown)
    .addKeyboardInput(ACTION.Left, Phaser.Input.Keyboard.KeyCodes.LEFT)
    .addKeyboardInput(ACTION.Left, Phaser.Input.Keyboard.KeyCodes.A)
    .addGamepadInput(ACTION.Left, GamepadButton.Left)
    .addGamepadInput(ACTION.Left, GamepadButton.StickLeftLeft)
    .addKeyboardInput(ACTION.Right, Phaser.Input.Keyboard.KeyCodes.RIGHT)
    .addKeyboardInput(ACTION.Right, Phaser.Input.Keyboard.KeyCodes.D)
    .addGamepadInput(ACTION.Right, GamepadButton.Right)
    .addGamepadInput(ACTION.Right, GamepadButton.StickLeftRight);
};

export const actionInput = (scene: Scene) => {
  return new Input(scene)
    .addKeyboardInput(ACTION.Action, Phaser.Input.Keyboard.KeyCodes.Z)
    .addGamepadInput(ACTION.Action, GamepadButton.A)
    .addGamepadInput(ACTION.Action, GamepadButton.B);
};

export const directionalInputs = (scene: Scene) => {
  return new Input(scene)
    .addKeyboardInput(ACTION.Up, Phaser.Input.Keyboard.KeyCodes.UP)
    .addKeyboardInput(ACTION.Up, Phaser.Input.Keyboard.KeyCodes.W)
    .addGamepadInput(ACTION.Up, GamepadButton.Up)
    .addGamepadInput(ACTION.Up, GamepadButton.StickLeftUp)
    .addKeyboardInput(ACTION.Down, Phaser.Input.Keyboard.KeyCodes.DOWN)
    .addKeyboardInput(ACTION.Down, Phaser.Input.Keyboard.KeyCodes.S)
    .addGamepadInput(ACTION.Down, GamepadButton.Down)
    .addGamepadInput(ACTION.Down, GamepadButton.StickLeftDown)
    .addKeyboardInput(ACTION.Left, Phaser.Input.Keyboard.KeyCodes.LEFT)
    .addKeyboardInput(ACTION.Left, Phaser.Input.Keyboard.KeyCodes.A)
    .addGamepadInput(ACTION.Left, GamepadButton.Left)
    .addGamepadInput(ACTION.Left, GamepadButton.StickLeftLeft)
    .addKeyboardInput(ACTION.Right, Phaser.Input.Keyboard.KeyCodes.RIGHT)
    .addKeyboardInput(ACTION.Right, Phaser.Input.Keyboard.KeyCodes.D)
    .addGamepadInput(ACTION.Right, GamepadButton.Right)
    .addGamepadInput(ACTION.Right, GamepadButton.StickLeftRight);
};
