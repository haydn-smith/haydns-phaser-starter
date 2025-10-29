import { Sequenceable } from 'systems/sequence/contracts/sequenceable';
import { Sequence as ObjectsSequence } from 'systems/sequence/objects/sequence';

export class Sequence {
  constructor(private sequence: ObjectsSequence) {}

  public of(sequenceables: Sequenceable[]): Sequence {
    this.sequence.setSequenables(sequenceables);

    return this;
  }

  public start(): Sequence {
    this.sequence.start();

    return this;
  }

  public stop(): Sequence {
    this.sequence.stop();

    return this;
  }

  public repeat(): Sequence {
    this.sequence.repeat();

    return this;
  }

  public reset(): Sequence {
    this.sequence.reset();

    return this;
  }

  public destroyWhenComplete(): Sequence {
    this.sequence.destroyWhenComplete();

    return this;
  }

  public isRunning(): boolean {
    return this.sequence.isRunning();
  }

  public isComplete(): boolean {
    return this.sequence.isComplete();
  }
}
