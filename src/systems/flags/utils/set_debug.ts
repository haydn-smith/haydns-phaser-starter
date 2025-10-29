import { debugFlag } from 'systems/flags/constants';
import { setFlag } from 'systems/flags/utils/set_flag';
import { unsetFlag } from 'systems/flags/utils/unset_flag';

export function setDebug(isDebug: boolean = true) {
  if (isDebug) {
    setFlag(debugFlag);
  } else {
    unsetFlag(debugFlag);
  }
}
