import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class Sequence extends Phaser.GameObjects.GameObject {
  constructor(
    scene: Phaser.Scene,
    private sequenceables: Sequenceable[] = [],
    private currentSequenceable: number = 0,
    private shouldProcess: boolean = false,
    private shouldRepeat: boolean = false,
    private shouldDestroyWhenComplete: boolean = false
  ) {
    super(scene, 'Sequenceable');

    this.renderFlags = 0;
  }

  public preUpdate(_time: number, delta: number) {
    if (this.isComplete() && this.shouldRepeat) {
      this.reset();
    }

    if (this.isComplete() && !this.shouldRepeat && this.shouldDestroyWhenComplete) {
      this.destroy();
    }

    if (this.isComplete() || !this.shouldProcess) {
      return;
    }

    this.sequenceables[this.currentSequenceable].update(delta);

    if (this.sequenceables[this.currentSequenceable].isComplete() && !this.isComplete()) {
      this.currentSequenceable++;
    }
  }

  public isComplete(): boolean {
    return (
      this.sequenceables.length === 0 ||
      (this.currentSequenceable === this.sequenceables.length - 1 &&
        this.sequenceables[this.currentSequenceable].isComplete())
    );
  }

  public start(): Sequence {
    this.shouldProcess = true;

    return this;
  }

  public stop(): Sequence {
    this.shouldProcess = false;

    return this;
  }

  public destroyWhenComplete(): Sequence {
    this.shouldDestroyWhenComplete = true;

    return this;
  }

  public repeat(): Sequence {
    this.shouldRepeat = true;

    return this;
  }

  public reset(): Sequence {
    this.currentSequenceable = 0;

    this.sequenceables.forEach((s) => s.reset());

    return this;
  }

  public isRunning(): boolean {
    return this.shouldProcess && !this.isComplete();
  }

  public setSequenables(sequenceables: Sequenceable[]): Sequence {
    this.sequenceables = sequenceables;

    return this;
  }

  public destroy(): void {
    this.sequenceables.forEach((s) => ('destroy' in s && typeof s.destroy === 'function' ? s.destroy() : undefined));

    super.destroy();
  }
}
