import { collisionBorder } from 'common/factories/collision';
import { directionalInputs } from 'common/factories/input';
import { rect, vec2 } from 'common/factories/phaser';
import { Collision, OnCollideFnProps } from 'common/objects/collision';
import { Input } from 'common/objects/input/input';
import { Scene } from 'common/scene';
import { ACTION, COLLISION_TAG } from 'constants';

const MOVE_SPEED = 200;

const PUSH_SPEED = 100;

export class CollisionExample extends Scene {
  private inputs: Input;

  private dot: Phaser.GameObjects.Container;

  private collision: Collision;

  private lastDirection: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  constructor() {
    super('Collision Example');
  }

  create() {
    // A moving dot with collision.
    this.dot = this.add.container(this.width() / 2, this.height() / 2);
    const graphics2 = this.add.graphics();
    this.dot.add(graphics2);
    graphics2.fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20);
    this.collision = this.add.existing(
      new Collision(this, 0, 0, 20, 20).setTag(COLLISION_TAG.PushesObjects).setTag(COLLISION_TAG.SlidesOnObjects)
    );
    this.dot.add(this.collision);

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
      x = this.lastDirection.x;
      y = this.lastDirection.y;
    }

    // Move the dot using collision. The collision's move function takes a callback that allows us to change what
    // happens when a future collision is detected.
    this.dot.setPosition(
      (this.dot.x += this.collision.moveX(x * delta * 0.001 * MOVE_SPEED, this.onCollide)),
      (this.dot.y += this.collision.moveY(y * delta * 0.001 * MOVE_SPEED, this.onCollide))
    );

    this.lastDirection = vec2(x, y);
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

      collision
        .getActor()
        .setPosition(
          (collision.getActor().x += collision.moveX(direction.x * delta * 0.001 * MOVE_SPEED)),
          (collision.getActor().y += collision.moveY(direction.y * delta * 0.001 * MOVE_SPEED))
        );
    }
  };
}
