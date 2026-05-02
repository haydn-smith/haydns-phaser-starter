import { Scene } from 'common/scene';
import { normalize } from 'common/utils/math';
import { linearMovement, MovementFn } from 'common/utils/movement_functions';
import { DEPTH } from 'constants';
import { Collision } from './collision';

// TODO: Add collision handling somehow.
export class Movement extends Phaser.GameObjects.GameObject {
  private graphics: Phaser.GameObjects.Graphics;
  private lastMovementDirection: Phaser.Math.Vector2 = Phaser.Math.Vector2.DOWN;
  private velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0);
  private easedVelocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0);
  private acceleration: number = 1200;
  private speed: number = 240;
  private easeFn: (v: number) => number = Phaser.Math.Easing.Linear;
  private movementFn: MovementFn = linearMovement;

  constructor(
    public scene: Scene,
    private actor: Phaser.GameObjects.Container,
    private collision: Collision
  ) {
    super(scene, 'Movement');

    this.renderFlags = 0;
    this.graphics = new Phaser.GameObjects.Graphics(this.scene);
  }

  public preUpdate(_: number, delta: number) {
    if (this.scene.app().isDebug()) {
      this.scene.add.existing(this.graphics);

      const d = this.actor.getWorldTransformMatrix().decomposeMatrix();

      this.graphics
        .setDepth(DEPTH.Debug)
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

    this.doMove(delta);
  }

  public destroy() {
    super.destroy();
    this.graphics.destroy();
  }

  public moveInDirection(direction: Phaser.Math.Vector2, delta: number): Movement {
    const velocity = this.movementFn({
      currentVelocity: this.velocity.clone(),
      direction,
      delta,
      speed: this.speed,
      acceleration: this.acceleration,
    });

    this.velocity = velocity;

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

  getActor() {
    return this.actor;
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
  }
}
