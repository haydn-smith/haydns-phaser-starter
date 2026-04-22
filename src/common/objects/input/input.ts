import { Inputtable } from 'common/contracts/inputtable';
import { Gamepad, GamepadInput, TypeOfGamepad, TypeOfGamepadButton } from './gamepad_input';
import { KeyboardInput } from './keyboard_input';
import { Scene } from 'common/scene';

export class Input extends Phaser.GameObjects.GameObject {
  private mappings: Record<string, Inputtable[]> = {};

  private disabled: Record<string, boolean> = {};

  constructor(public scene: Scene) {
    super(scene, 'Input');

    this.renderFlags = 0;
  }

  public isJustPressed(key: string): boolean {
    if (this.disabled[key]) {
      return false;
    }

    const inputs = this.mappings[key] ?? [];

    return inputs.reduce((acc, curr) => acc || curr.isJustPressed(), false);
  }

  public isPressed(key: string): number {
    if (this.disabled[key]) {
      return 0;
    }

    const inputs = this.mappings[key] ?? [];

    return inputs.reduce((acc, curr) => Math.max(acc, curr.isPressed()), 0);
  }

  public addKeyboardInput(action: string, key: string | number) {
    this.addInput(action, new KeyboardInput(this.scene, key).addToUpdateList());

    return this;
  }

  public addGamepadInput(action: string, button: TypeOfGamepadButton, pad: TypeOfGamepad = Gamepad.One) {
    this.addInput(action, new GamepadInput(this.scene, button, pad).addToUpdateList());

    return this;
  }

  public addInput(key: string, input: Inputtable): Input {
    if (!this.mappings[key]) {
      this.mappings[key] = [];
    }

    this.mappings[key].push(input);

    return this;
  }

  public disable(key: string): Input {
    this.disabled[key] = true;

    return this;
  }

  public enable(key: string): Input {
    this.disabled[key] = false;

    return this;
  }
}
