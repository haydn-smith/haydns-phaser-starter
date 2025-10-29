import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class RunCallback implements Sequenceable {
  private hasRunCallback = false;

  constructor(private fn: () => void) {}

  public update() {
    this.fn();

    this.hasRunCallback = true;
  }

  public isComplete(): boolean {
    return this.hasRunCallback;
  }

  public reset() {
    this.hasRunCallback = false;
  }
}
