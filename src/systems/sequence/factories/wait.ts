import { Wait } from 'systems/sequence/sequences/wait';

export function wait(duration: number | (() => number)): Wait {
  return new Wait(duration);
}
