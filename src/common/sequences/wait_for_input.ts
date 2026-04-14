import { Sequenceable } from 'common/contracts/sequenceable';
import { Input } from 'common/objects/input/input';

export class WaitForInput implements Sequenceable {
  private isInputPressed = false;

  constructor(
    private inputs: Input,
    private key: string
  ) {}

  public update() {
    if (this.inputs.isJustPressed(this.key)) {
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
