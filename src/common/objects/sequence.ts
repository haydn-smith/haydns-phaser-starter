import { Sequenceable } from 'common/contracts/sequenceable';
import { Scene } from 'common/scene';

export class Sequence extends Phaser.GameObjects.GameObject {
  private currentSequenceable: number = 0;
  private shouldProcess: boolean = false;
  private shouldRepeat: boolean = false;
  private shouldDestroyWhenComplete: boolean = false;

  constructor(
    public scene: Scene,
    private sequenceables: Sequenceable[] = []
  ) {
    super(scene, 'Sequenceable');

    this.renderFlags = 0;

    this.on('destroy', () => {
      this.sequenceables.filter((s) => s instanceof Phaser.GameObjects.GameObject).forEach((s) => s.destroy());
    });
  }

  preUpdate(_: number, delta: number) {
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

  isComplete() {
    return (
      this.sequenceables.length === 0 ||
      (this.currentSequenceable === this.sequenceables.length - 1 &&
        this.sequenceables[this.currentSequenceable].isComplete())
    );
  }

  start() {
    this.shouldProcess = true;

    return this;
  }

  stop() {
    this.shouldProcess = false;

    return this;
  }

  destroyWhenComplete() {
    this.shouldDestroyWhenComplete = true;

    return this;
  }

  repeat() {
    this.shouldRepeat = true;

    return this;
  }

  reset() {
    this.currentSequenceable = 0;

    this.sequenceables.forEach((s) => s.reset());

    return this;
  }

  isRunning() {
    return this.shouldProcess && !this.isComplete();
  }

  setSequenables(sequenceables: Sequenceable[]) {
    this.sequenceables = sequenceables;

    return this;
  }
}
