import { TypeOfFlag } from 'constants';
import { logEvent } from './utils/log';

export class Game extends Phaser.Game {
  private debug: boolean = false;

  private flags: Partial<Record<TypeOfFlag, boolean>> = {};

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
}
