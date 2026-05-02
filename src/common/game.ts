import { TypeOfFlag } from 'constants';
import { GUI } from 'lil-gui';
import { TypeOfKeyCode } from './objects/input/keyboard_input';
import { logEvent } from './utils/log';

export class Game extends Phaser.Game {
  private debug: boolean = false;

  private gui?: GUI;

  private flags: Partial<Record<TypeOfFlag, boolean>> = {};

  private keys: Record<number, Phaser.Input.Keyboard.Key> = {};

  constructor(config?: Phaser.Types.Core.GameConfig & { debug: true }) {
    super(config);

    this.debug = config?.debug ?? false;
  }

  checkFlag(flag: TypeOfFlag): boolean {
    return this.flags[flag] ?? false;
  }

  setFlag(flag: TypeOfFlag) {
    if (this.checkFlag(flag)) return;

    logEvent('Setting flag.', flag);

    this.flags[flag] = true;

    return this;
  }

  unsetFlag(flag: TypeOfFlag) {
    if (!this.checkFlag(flag)) return;

    logEvent('Un-setting flag.', flag);

    this.flags[flag] = false;

    return this;
  }

  setDebug(debug: boolean = true) {
    logEvent('Setting debug.', debug);

    this.debug = debug;
  }

  isDebug() {
    return this.debug;
  }

  controlNumber<T>(name: string, object: T, property: keyof T, min?: number, max?: number, step?: number) {
    this.gui ??= new GUI();

    this.gui.add(object, property, min, max, step).name(name);

    return this;
  }

  controlBoolean<T>(name: string, object: T, property: keyof T) {
    this.gui ??= new GUI();

    this.gui.add(object, property).name(name);

    return this;
  }

  controlString<T>(name: string, object: T, property: keyof T) {
    this.gui ??= new GUI();

    this.gui.add(object, property).name(name);

    return this;
  }

  controlDropdown<T>(name: string, object: T, property: keyof T, options: unknown[]) {
    this.gui ??= new GUI();

    this.gui.add(object, property, options).name(name);

    return this;
  }

  controlCallback(name: string, fn: () => void) {
    this.gui ??= new GUI();

    this.gui.add({ fn }, `fn`).name(name);

    return this;
  }

  registerKeyboardKey(input: Phaser.Input.Keyboard.KeyboardPlugin, keyCode: TypeOfKeyCode): Phaser.Input.Keyboard.Key {
    const existing = this.keys[keyCode] ?? keyCode;

    const key = input.addKey(existing);

    this.keys[key?.keyCode ?? 0] = key;

    return key;
  }
}
