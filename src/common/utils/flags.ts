import { logEvent } from './log';

const flagPrefix = 'user.game.';
const debugFlag = 'debug';

export function checkFlag(flag: string): boolean {
  return Boolean(localStorage.getItem(`${flagPrefix}${flag}`));
}

export function setFlag(flag: string): void {
  if (checkFlag(flag)) return;

  logEvent('Setting flag.', flag);

  localStorage.setItem(`${flagPrefix}${flag}`, '1');
}

export function unsetFlag(flag: string) {
  if (!checkFlag(flag)) return;

  logEvent('Un-setting flag.', flag);

  localStorage.removeItem(`${flagPrefix}${flag}`);
}

export function setDebug(isDebug: boolean = true) {
  if (isDebug) {
    setFlag(debugFlag);
  } else {
    unsetFlag(debugFlag);
  }
}

export function isDebug() {
  return checkFlag(debugFlag);
}
