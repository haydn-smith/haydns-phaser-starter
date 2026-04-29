import { Sequenceable } from 'common/contracts/sequenceable';
import { Input } from 'common/objects/input/input';
import { TypeOfAction } from 'constants';

export class WaitForInput implements Sequenceable {
  private isInputPressed = false;

  constructor(
    private inputs: Input,
    private action: TypeOfAction
  ) {}

  public update() {
    if (this.inputs.isJustPressed(this.action)) {
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
