import { Collision } from 'systems/collision';
import { debugDepth, isDebug } from 'systems/flags';
import { linearMovement } from 'systems/movement/utils/linear_movement';
import { velocityMovement } from 'systems/movement/utils/velocity_movement';
import { states, States } from 'systems/states';

type MovementStates = 'idle' | 'moveToTarget';

const normalize = (min: number, max: number, position: number): number => {
  return position - min == 0 ? 0 : (position - min) / (max - min);
};

export type MovementFn = (
  currentVelocity: Phaser.Math.Vector2,
  direction: Phaser.Math.Vector2,
  delta: number,
  speed: number,
  acceleration: number
) => Phaser.Math.Vector2;

export class Movement extends Phaser.GameObjects.GameObject {
  private graphics: Phaser.GameObjects.Graphics;

  private lastMovementDirection: Phaser.Math.Vector2 = Phaser.Math.Vector2.DOWN;
  private prevVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0);
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0);
  private easedVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0);
  private acceleration: number = 1200;
  private speed: number = 240;

  private target?: Phaser.Math.Vector2;

  private states: States<MovementStates, 'idle'>;

  private easeFn: (v: number) => number = Phaser.Math.Easing.Linear;

  private movementFn: MovementFn = linearMovement;

  constructor(
    scene: Phaser.Scene,
    private actor: Phaser.GameObjects.Container,
    private collision: Collision
  ) {
    super(scene, 'Movement');

    this.renderFlags = 0;

    this.graphics = this.scene.add.graphics();

    this.states = states<MovementStates, 'idle'>(scene, 'idle')
      .add('idle', () => {})
      .add('moveToTarget', ({ change, delta }) => {
        if (!this.target) {
          change('idle');

          return;
        }

        const difference = this.target.clone().subtract(this.currentPosition());

        if (Math.abs(difference.x) < this.speed * delta * 0.001) {
          this.actor.x = this.target.x;
        }

        if (Math.abs(difference.y) < this.speed * delta * 0.001) {
          this.actor.y = this.target.y;
        }

        if (difference.length() < this.speed * delta * 0.001) {
          this.actor.setPosition(this.target.x, this.target.y);
          this.velocity = Phaser.Math.Vector2.ZERO;

          change('idle');

          return;
        }

        const direction = new Phaser.Math.Vector2(
          Math.abs(difference.x) < this.speed * delta * 0.001 ? 0 : difference.x > 0 ? 1 : -1,
          Math.abs(difference.y) < this.speed * delta * 0.001 ? 0 : difference.y > 0 ? 1 : -1
        );

        this.moveInDirection(direction, delta);
      });
  }

  public preUpdate(_: number, delta: number) {
    if (isDebug()) {
      const d = this.actor.getWorldTransformMatrix().decomposeMatrix();

      this.graphics
        .setDepth(debugDepth())
        .clear()
        .lineStyle(6, 0xff0000, 1)
        .lineBetween(d.translateX, d.translateY, d.translateX + this.velocity.x, d.translateY + this.velocity.y)
        .lineStyle(2, 0x00ff00, 1)
        .lineBetween(
          d.translateX,
          d.translateY,
          d.translateX + this.easedVelocity.x,
          d.translateY + this.easedVelocity.y
        );
    }

    if (
      this.movementFn === velocityMovement &&
      this.prevVelocity.x === this.velocity.x &&
      !this.velocity.equals(Phaser.Math.Vector2.ZERO)
    ) {
      this.moveInDirection(this.velocity.clone().negate().multiply({ x: 1, y: 0 }), delta, false);
    }

    if (
      this.movementFn === velocityMovement &&
      this.prevVelocity.y === this.velocity.y &&
      !this.velocity.equals(Phaser.Math.Vector2.ZERO)
    ) {
      this.moveInDirection(this.velocity.clone().negate().multiply({ x: 0, y: 1 }), delta, false);
    }

    this.doMove(delta);
  }

  public destroy() {
    super.destroy();
    this.graphics.destroy();
    this.states.destroy();
  }

  public moveInDirection(direction: Phaser.Math.Vector2, delta: number, crossZero = true): Movement {
    const velocity = this.movementFn(this.velocity.clone(), direction, delta, this.speed, this.acceleration);

    const xCrossedZero = (velocity.x > 0 && this.velocity.x < 0) || (velocity.x < 0 && this.velocity.x > 0);

    const yCrossedZero = (velocity.y > 0 && this.velocity.y < 0) || (velocity.y < 0 && this.velocity.y > 0);

    if (!crossZero && xCrossedZero) {
      velocity.x = 0;
    }

    if (!crossZero && yCrossedZero) {
      velocity.y = 0;
    }

    this.velocity = velocity;

    return this;
  }

  private doMove(delta: number) {
    if (!this.velocity.equals(Phaser.Math.Vector2.ZERO)) {
      this.lastMovementDirection = this.velocity.clone().normalize();
    }

    const normalized = normalize(0, this.speed, this.velocity.length());

    const eased = this.easeFn(normalized);

    this.easedVelocity = this.velocity
      .clone()
      .normalize()
      .multiply({
        x: this.speed * eased,
        y: this.speed * eased,
      });

    const moveY = this.collision.moveY(this.easedVelocity.y * (delta * 0.001), () => (this.velocity.y = 0));

    const moveX = this.collision.moveX(this.easedVelocity.x * (delta * 0.001), () => (this.velocity.x = 0));

    this.actor.setPosition(this.actor.x, this.actor.y + moveY);

    this.actor.setPosition(this.actor.x + moveX, this.actor.y);

    this.prevVelocity = this.velocity;
  }

  public moveTo(position: Phaser.Math.Vector2): Movement {
    this.target = position;

    this.states.change('moveToTarget');

    return this;
  }

  public faceDirection(direction: Phaser.Math.Vector2): Movement {
    this.lastMovementDirection = direction.clone().normalize();

    return this;
  }

  public isNotMoving(): boolean {
    return this.velocity.equals(Phaser.Math.Vector2.ZERO);
  }

  public isMoving(): boolean {
    return !this.isNotMoving();
  }

  public currentPosition(): Phaser.Math.Vector2 {
    const d = this.actor.getWorldTransformMatrix().decomposeMatrix();

    return new Phaser.Math.Vector2(d.translateX, d.translateY);
  }

  public getCardinalDirection(): 'north' | 'south' | 'east' | 'west' {
    const angle = this.lastMovementDirection.angle();
    const quarterPi = Math.PI / 4;

    if (angle < quarterPi || angle > quarterPi * 7) {
      return 'east';
    } else if (angle < quarterPi * 5 && angle > quarterPi * 3) {
      return 'west';
    } else if (angle >= quarterPi * 5 && angle <= quarterPi * 7) {
      return 'north';
    } else if (angle >= quarterPi && angle <= quarterPi * 3) {
      return 'south';
    }

    throw new Error('Could not resolve cardinal direction of actor!');
  }

  public getSpeed(): number {
    return this.speed;
  }

  public setSpeed(speed: number): Movement {
    this.speed = speed;

    return this;
  }

  public getAcceleration(): number {
    return this.acceleration;
  }

  public setAcceleration(acceleration: number): Movement {
    this.acceleration = acceleration;

    return this;
  }

  public getPosition() {
    return new Phaser.Math.Vector2(this.actor.x, this.actor.y);
  }

  public getVelocity() {
    return this.velocity;
  }

  public setVelocity(velocity: Phaser.Math.Vector2) {
    this.velocity = velocity;

    return this;
  }

  public setMovementEase(easeFn: (v: number) => number): Movement {
    this.easeFn = easeFn;

    return this;
  }

  public setMovementStrategy(movementFn: MovementFn): Movement {
    this.movementFn = movementFn;

    return this;
  }
}
