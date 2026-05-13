import { GUI } from 'lil-gui';
import { Saver } from './contracts/saver';
import { TypeOfKeyCode } from './objects/input/keyboard_input';
import { SaveData } from './save_data';
import { LocalStorageSaver } from './savers/local_storage_saver';
import { logEvent } from './utils/log';

export class Game extends Phaser.Game {
  private debug: boolean = false;

  private gui?: GUI;

  private keys: Record<number, Phaser.Input.Keyboard.Key> = {};

  private saver: Saver;

  private saveData: SaveData;

  constructor(config?: Phaser.Types.Core.GameConfig & { debug?: boolean; saver?: Saver }) {
    super(config);

    this.debug = config?.debug ?? false;
    this.saver = config?.saver ?? new LocalStorageSaver();

    // Initialise persisted data.
    this.load();

    // Save persisted data when the window closes.
    window.addEventListener('beforeunload', () => {
      this.save();
    });
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

  load() {
    logEvent('Loading game.');

    this.saveData = this.saver.load();

    return this;
  }

  save() {
    logEvent('Saving game.');

    this.saver.save(this.saveData);

    return this;
  }

  data() {
    return this.saveData;
  }
}
