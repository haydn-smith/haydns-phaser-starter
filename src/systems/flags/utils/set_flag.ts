import { flagPrefix } from 'systems/flags/constants';
import { checkFlag } from 'systems/flags/utils/check_flag';

export function setFlag(flag: string): void {
  if (checkFlag(flag)) return;

  console.info(`Event: Setting flag "${flag}".`);

  localStorage.setItem(`${flagPrefix}${flag}`, '1');
}
