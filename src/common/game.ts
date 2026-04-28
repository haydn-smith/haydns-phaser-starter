import { TypeOfFlag } from 'constants';
import { GUI } from 'lil-gui';
import { logEvent } from './utils/log';

export class Game extends Phaser.Game {
  private debug: boolean = false;

  private flags: Partial<Record<TypeOfFlag, boolean>> = {};

  private gui?: GUI;

  constructor(config?: Phaser.Types.Core.GameConfig & { debug: true }) {
    super(config);

    this.debug = config?.debug ?? false;
  }

  public checkFlag(flag: TypeOfFlag): boolean {
    return this.flags[flag] ?? false;
  }

  public setFlag(flag: TypeOfFlag) {
    if (this.checkFlag(flag)) return;

    logEvent('Setting flag.', flag);

    this.flags[flag] = true;

    return this;
  }

  public unsetFlag(flag: TypeOfFlag) {
    if (!this.checkFlag(flag)) return;

    logEvent('Un-setting flag.', flag);

    this.flags[flag] = false;

    return this;
  }

  public setDebug(debug: boolean = true) {
    logEvent('Setting debug.', debug);

    this.debug = debug;
  }

  public isDebug() {
    return this.debug;
  }

  public controlNumber<T>(name: string, object: T, property: keyof T, min?: number, max?: number, step?: number) {
    this.gui ??= new GUI();

    this.gui.add(object, property, min, max, step).name(name);

    return this;
  }

  public controlBoolean<T>(name: string, object: T, property: keyof T) {
    this.gui ??= new GUI();

    this.gui.add(object, property).name(name);

    return this;
  }

  public controlString<T>(name: string, object: T, property: keyof T) {
    this.gui ??= new GUI();

    this.gui.add(object, property).name(name);

    return this;
  }

  public controlDropdown<T>(name: string, object: T, property: keyof T, options: unknown[]) {
    this.gui ??= new GUI();

    this.gui.add(object, property, options).name(name);

    return this;
  }

  public controlCallback(name: string, fn: () => void) {
    this.gui ??= new GUI();

    this.gui.add({ fn }, `fn`).name(name);

    return this;
  }
}
