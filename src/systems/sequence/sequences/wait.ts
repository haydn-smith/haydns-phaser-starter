import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class Wait implements Sequenceable {
  private elapsed = 0;

  private resolvedDuration?: number = undefined;

  constructor(private duration: number | (() => number)) {}

  public update(delta: number) {
    if (this.resolvedDuration === undefined) {
      this.resolvedDuration = this.resolveDuration();
    }

    this.elapsed += delta;
  }

  public isComplete(): boolean {
    return this.resolvedDuration !== undefined && this.elapsed > this.resolvedDuration;
  }

  public reset() {
    this.elapsed = 0;
    this.resolvedDuration = undefined;
  }

  private resolveDuration(): number {
    if (typeof this.duration === 'function') {
      return this.duration();
    }

    return this.duration;
  }
}
