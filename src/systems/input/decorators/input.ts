import { Gamepad, TypeOfGamepad, TypeOfGamepadButton } from 'systems/input/constants';
import { Inputtable } from 'systems/input/contracts/inputtable';
import { gamepadInput } from 'systems/input/factories/gamepad_input';
import { keyboardInput } from 'systems/input/factories/keyboard_input';
import { Input as InputObject } from 'systems/input/objects/input';

export class Input {
  constructor(private input: InputObject) {}

  public add(action: string, input: Inputtable) {
    this.input.addMapping(action, input);

    return this;
  }

  public addKeyboardInput(action: string, key: string | number) {
    this.add(action, keyboardInput(this.input.scene, key));

    return this;
  }

  public addGamepadInput(action: string, button: TypeOfGamepadButton, pad: TypeOfGamepad = Gamepad.One) {
    this.add(action, gamepadInput(this.input.scene, button, pad));

    return this;
  }

  public isActive(action: string): number {
    return this.input.isPressed(action);
  }

  public wasJustActive(action: string): boolean {
    return this.input.isJustPressed(action);
  }
}
