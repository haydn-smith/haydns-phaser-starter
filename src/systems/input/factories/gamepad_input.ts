import { Gamepad, TypeOfGamepad, TypeOfGamepadButton } from 'systems/input/constants';
import { GamepadInput } from 'systems/input/objects/gamepad_input';

export function gamepadInput(scene: Phaser.Scene, button: TypeOfGamepadButton, pad: TypeOfGamepad = Gamepad.One) {
  return new GamepadInput(scene, button, pad).addToUpdateList();
}
