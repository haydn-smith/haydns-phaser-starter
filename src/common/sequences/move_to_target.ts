import { Sequenceable } from 'common/contracts/sequenceable';
import { vec2 } from 'common/factories/phaser';
import { Movement } from 'common/objects/movement';

export class MoveToTarget implements Sequenceable {
  private isStarted: boolean = false;

  constructor(
    private movement: Movement,
    private target: Phaser.Math.Vector2,
    private threshold = 16
  ) {}

  reset(): void {
    this.isStarted = false;
  }

  update(delta: number): void {
    if (!this.isStarted) {
      this.isStarted = true;
    }

    this.movement.moveInDirection(
      this.target.clone().subtract(vec2(this.movement.getActor().x, this.movement.getActor().y)),
      delta
    );
  }

  isComplete(): boolean {
    return (
      this.target.clone().subtract(vec2(this.movement.getActor().x, this.movement.getActor().y)).length() <
      this.threshold
    );
  }
}
