import { Sequenceable } from 'common/contracts/sequenceable';
import { vec2 } from 'common/factories/phaser';
import { Movement } from 'common/objects/movement';
import { Edge } from 'common/objects/pathfinder';

export class MoveAlongPath implements Sequenceable {
  private current = 0;
  private target: Phaser.Math.Vector2;
  private finish: Phaser.Math.Vector2;
  private timeForTarget = 0;
  private failedToReachTarget = false;

  constructor(
    private movement: Movement,
    private path: Edge[],
    private threshold = 16,
    private timeout = 3000
  ) {
    this.target = this.path[this.current]?.to;
    this.finish = this.path[path.length - 1]?.to;
  }

  reset(): void {
    this.current = 0;
    this.target = this.path[this.current].to;
    this.timeForTarget = 0;
    this.failedToReachTarget = false;
  }

  update(delta: number): void {
    this.movement.moveInDirection(
      this.target.clone().subtract(vec2(this.movement.getActor().x, this.movement.getActor().y)),
      delta
    );

    this.timeForTarget += delta;
    if (this.timeForTarget > this.timeout) {
      this.failedToReachTarget = true;
    }

    if (this.isAtTarget(this.target)) {
      this.current++;
      this.target = this.path[this.current].to;
      this.timeForTarget = 0;
    }
  }

  isComplete(): boolean {
    return this.isAtTarget(this.finish) || this.failedToReachTarget;
  }

  private isAtTarget(target?: Phaser.Math.Vector2) {
    return (
      target === undefined ||
      target.clone().subtract(vec2(this.movement.getActor().x, this.movement.getActor().y)).length() < this.threshold
    );
  }
}
