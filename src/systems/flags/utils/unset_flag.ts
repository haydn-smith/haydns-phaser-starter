import { flagPrefix } from 'systems/flags/constants';
import { checkFlag } from 'systems/flags/utils/check_flag';

export function unsetFlag(flag: string) {
  if (!checkFlag(flag)) return;

  console.info(`Event: Unsetting flag "${flag}".`);

  localStorage.removeItem(`${flagPrefix}${flag}`);
}
