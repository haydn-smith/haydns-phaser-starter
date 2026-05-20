import { Sequenceable } from 'common/contracts/sequenceable';

export class Sequence implements Sequenceable {
  private currentSequenceable: number = 0;

  constructor(private sequenceables: Sequenceable[] = []) {}

  update(delta: number) {
    this.sequenceables[this.currentSequenceable].update(delta);

    if (this.sequenceables[this.currentSequenceable].isComplete() && !this.isComplete()) {
      this.currentSequenceable++;
    }
  }

  isComplete() {
    return (
      this.sequenceables.length === 0 ||
      (this.currentSequenceable === this.sequenceables.length - 1 &&
        this.sequenceables[this.currentSequenceable].isComplete())
    );
  }

  reset() {
    this.currentSequenceable = 0;

    this.sequenceables.forEach((s) => s.reset());
  }
}
