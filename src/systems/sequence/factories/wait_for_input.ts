import { Input } from 'systems/input';
import { WaitForInput } from 'systems/sequence/sequences/wait_for_input';

export function waitForInput(inputs: Input, key: string): WaitForInput {
  return new WaitForInput(inputs, key);
}
