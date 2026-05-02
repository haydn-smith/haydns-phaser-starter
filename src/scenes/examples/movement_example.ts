import { collisionBorder } from 'common/factories/collision';
import { directionalInputs } from 'common/factories/input';
import { rect, vec2 } from 'common/factories/phaser';
import { Collision, OnCollideFnProps } from 'common/objects/collision';
import { Input } from 'common/objects/input/input';
import { Movement } from 'common/objects/movement';
import { Scene } from 'common/scene';
import { velocityMovement } from 'common/utils/movement_functions';
import { ACTION, COLLISION_TAG } from 'constants';

const PUSH_SPEED = 100;

export class MovementExample extends Scene {
  private inputs: Input;
  private dot: Phaser.GameObjects.Container;
  private collision: Collision;
  private movement: Movement;

  constructor() {
    super('Movement Example');
  }

  create() {
    // A moving dot.
    this.dot = this.add.container(this.width() / 2, this.height() / 2);
    const graphics2 = this.add.graphics();
    this.dot.add(graphics2);
    graphics2.fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20);
    this.collision = this.add.existing(
      new Collision(this, 0, 0, 20, 20).setTag(COLLISION_TAG.PushesObjects).setTag(COLLISION_TAG.SlidesOnObjects)
    );
    this.dot.add(this.collision);

    // Add the movement object to it.
    this.movement = this.add.existing(
      new Movement(this, this.dot, this.collision)
        .setMovementEase(Phaser.Math.Easing.Quintic.In)
        .setMovementStrategy(velocityMovement)
    );

    // Input controller.
    this.inputs = this.add.existing(directionalInputs(this));

    // A thing to collide with.
    collisionBorder(this, rect(100, 100, this.width() - 200, this.height() - 200)).forEach((c) => this.add.existing(c));

    // Things to push.
    this.add
      .existing(new Collision(this, 400, 200, 100, 100))
      .setTag(COLLISION_TAG.Pushable)
      .setTag(COLLISION_TAG.PushesObjects);
    this.add
      .existing(new Collision(this, 600, 200, 100, 100))
      .setTag(COLLISION_TAG.Pushable)
      .setTag(COLLISION_TAG.PushesObjects);

    // A thing to slide on.
    this.add
      .existing(new Collision(this, this.width() - 500, this.height() - 500, 200, 200))
      .setTag(COLLISION_TAG.Slideable)
      .setSolid(false);

    // So we can see the collision AABBs.
    this.app().setDebug();
  }

  update(_: number, delta: number) {
    let x = this.inputs.isPressed(ACTION.Right) - this.inputs.isPressed(ACTION.Left);
    let y = this.inputs.isPressed(ACTION.Down) - this.inputs.isPressed(ACTION.Up);

    // We can check for intersections at any time, on any collision object.
    if (this.collision.intersectsWithTag(COLLISION_TAG.Slideable).length) {
      x = this.movement.getVelocity().x;
      y = this.movement.getVelocity().y;
    }

    // Move the dot using movement. The collision's move function takes a callback that allows us to change what
    // happens when a future collision is detected.
    this.movement.moveInDirection(vec2(x, y), delta, this.onCollide);
  }

  private onCollide = ({ collision, other, delta, remaining }: OnCollideFnProps) => {
    const direction = remaining.clone().normalize();

    if (other.hasTag(COLLISION_TAG.Pushable) && collision.hasTag(COLLISION_TAG.PushesObjects)) {
      other
        .getActor()
        .setPosition(
          (other.getActor().x += other.moveX(direction.x * delta * 0.001 * PUSH_SPEED, this.onCollide)),
          (other.getActor().y += other.moveY(direction.y * delta * 0.001 * PUSH_SPEED, this.onCollide))
        );
    }
  };
}
