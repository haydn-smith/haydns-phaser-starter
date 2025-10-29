import { debugFlag } from 'systems/flags/constants';
import { checkFlag } from 'systems/flags/utils/check_flag';

export function isDebug() {
  return checkFlag(debugFlag);
}
