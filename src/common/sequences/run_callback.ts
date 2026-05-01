import { Sequenceable } from 'common/contracts/sequenceable';

export class RunCallback implements Sequenceable {
  private hasRunCallback = false;

  constructor(private fn: () => void) {}

  update() {
    this.fn();

    this.hasRunCallback = true;
  }

  isComplete() {
    return this.hasRunCallback;
  }

  reset() {
    this.hasRunCallback = false;
  }
}
