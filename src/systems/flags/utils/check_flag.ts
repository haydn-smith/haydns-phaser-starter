import { flagPrefix } from 'systems/flags/constants';

export function checkFlag(flag: string): boolean {
  return Boolean(localStorage.getItem(`${flagPrefix}${flag}`));
}
