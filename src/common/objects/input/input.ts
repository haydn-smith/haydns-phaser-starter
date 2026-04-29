import { Inputtable } from 'common/contracts/inputtable';
import { Scene } from 'common/scene';
import { TypeOfAction } from 'constants';
import { Gamepad, GamepadInput, TypeOfGamepad, TypeOfGamepadButton } from './gamepad_input';
import { KeyboardInput, TypeOfKeyCode } from './keyboard_input';

export class Input extends Phaser.GameObjects.GameObject {
  private mappings: Partial<Record<TypeOfAction, Inputtable[]>> = {};

  private disabled: Partial<Record<TypeOfAction, boolean>> = {};

  constructor(public scene: Scene) {
    super(scene, 'Input');

    this.renderFlags = 0;

    this.on('destroy', () => {
      this.getGameObjects().forEach((o) => o.destroy());
    });
  }

  preUpdate() {
    this.getGameObjects().forEach((o) => this.scene.add.existing(o));
  }

  isJustPressed(action: TypeOfAction) {
    if (this.disabled[action]) {
      return false;
    }

    const inputs = this.mappings[action] ?? [];

    return inputs.reduce((acc, curr) => acc || curr.isJustPressed(), false);
  }

  isPressed(action: TypeOfAction) {
    if (this.disabled[action]) {
      return 0;
    }

    const inputs = this.mappings[action] ?? [];

    return inputs.reduce((acc, curr) => Math.max(acc, curr.isPressed()), 0);
  }

  addKeyboardInput(action: TypeOfAction, key: TypeOfKeyCode) {
    this.addInput(action, new KeyboardInput(this.scene, key));

    return this;
  }

  addGamepadInput(action: TypeOfAction, button: TypeOfGamepadButton, pad: TypeOfGamepad = Gamepad.One) {
    this.addInput(action, new GamepadInput(this.scene, button, pad));

    return this;
  }

  addInput(action: TypeOfAction, input: Inputtable) {
    if (!this.mappings[action]) {
      this.mappings[action] = [];
    }

    this.mappings[action].push(input);

    return this;
  }

  disable(action: TypeOfAction) {
    this.disabled[action] = true;

    return this;
  }

  disableAll() {
    Object.keys(this.mappings).forEach((action) => this.disable(action as TypeOfAction));

    return this;
  }

  enable(action: TypeOfAction) {
    this.disabled[action] = false;

    return this;
  }

  enableAll() {
    Object.keys(this.mappings).forEach((action) => this.enable(action as TypeOfAction));

    return this;
  }

  private getGameObjects(): Phaser.GameObjects.GameObject[] {
    return Object.values(this.mappings)
      .flatMap((mapping) => mapping)
      .filter((o) => o instanceof Phaser.GameObjects.GameObject);
  }
}
