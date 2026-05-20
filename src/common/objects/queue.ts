import { Sequenceable } from 'common/contracts/sequenceable';
import { Scene } from 'common/scene';

export class Queue extends Phaser.GameObjects.GameObject {
  private queue: Sequenceable[] = [];

  private current?: Sequenceable = undefined;

  private process = true;

  constructor(public scene: Scene) {
    super(scene, 'Queue');
  }

  preUpdate(_: number, delta: number) {
    if (!this.process) return;

    if ((!this.current || this.current.isComplete()) && this.queue.length) {
      this.current = this.queue.shift();
    }

    if (this.current) {
      this.current.update(delta);
    }
  }

  push(sequenceable: Sequenceable) {
    this.queue.push(sequenceable);

    return this;
  }

  stop() {
    this.process = false;

    return this;
  }

  start() {
    this.process = true;

    return this;
  }
}
