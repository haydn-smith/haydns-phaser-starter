import { Input } from 'systems/input';
import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class WaitForInput implements Sequenceable {
  private isInputPressed = false;

  constructor(
    private inputs: Input,
    private key: string
  ) {}

  public update() {
    if (this.inputs.wasJustActive(this.key)) {
      this.isInputPressed = true;
    }
  }

  public isComplete(): boolean {
    return this.isInputPressed;
  }

  public reset() {
    this.isInputPressed = false;
  }
}
