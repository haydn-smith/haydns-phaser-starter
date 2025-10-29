import { Movement as ObjectsMovement } from 'systems/movement/objects/movement';
import { linearMovement } from 'systems/movement/utils/linear_movement';
import { velocityMovement } from 'systems/movement/utils/velocity_movement';

export class Movement {
  constructor(private movement: ObjectsMovement) {}

  public moveInDirection(direction: Phaser.Math.Vector2, delta: number): Movement {
    this.movement.moveInDirection(direction, delta, true);

    return this;
  }

  public moveTo(position: Phaser.Math.Vector2): Movement {
    this.movement.moveTo(position);

    return this;
  }

  public isMoving(): boolean {
    return this.movement.isMoving();
  }

  public isNotMoving(): boolean {
    return !this.isMoving();
  }

  public cardinal(): 'north' | 'south' | 'east' | 'west' {
    return this.movement.getCardinalDirection();
  }

  public speed(): number {
    return this.movement.getSpeed();
  }

  public setSpeed(speed: number): Movement {
    this.movement.setSpeed(speed);

    return this;
  }

  public acceleration(): number {
    return this.movement.getAcceleration();
  }

  public setAcceleration(acceleration: number): Movement {
    this.movement.setAcceleration(acceleration);

    return this;
  }

  public setMovementEase(easeFn: (v: number) => number): Movement {
    this.movement.setMovementEase(easeFn);

    return this;
  }

  public moveWithVelocity(): Movement {
    this.movement.setMovementStrategy(velocityMovement);

    return this;
  }

  public moveWithoutVelocity(): Movement {
    this.movement.setMovementStrategy(linearMovement);

    return this;
  }

  public velocity(): Phaser.Math.Vector2 {
    return this.movement.getVelocity();
  }

  public position(): Phaser.Math.Vector2 {
    return this.movement.currentPosition();
  }

  public stop(): Movement {
    this.movement.setVelocity(Phaser.Math.Vector2.ZERO);

    return this;
  }

  public destroy(): void {
    this.movement.destroy();
  }
}
