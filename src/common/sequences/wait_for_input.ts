import { Sequenceable } from 'common/contracts/sequenceable';
import { Input } from 'common/objects/input/input';
import { TypeOfAction } from 'constants';

export class WaitForInput implements Sequenceable {
  private isInputPressed = false;

  constructor(
    private inputs: Input,
    private action: TypeOfAction
  ) {}

  update() {
    if (this.inputs.isJustPressed(this.action)) {
      this.isInputPressed = true;
    }
  }

  isComplete() {
    return this.isInputPressed;
  }

  reset() {
    this.isInputPressed = false;
  }
}
