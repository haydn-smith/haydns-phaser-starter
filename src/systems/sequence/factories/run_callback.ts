import { RunCallback } from 'systems/sequence/sequences/run_callback';

export function runCallback(callback: () => void): RunCallback {
  return new RunCallback(callback);
}
