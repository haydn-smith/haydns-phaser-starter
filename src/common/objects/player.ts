import { directionalInputs } from 'common/factories/input';
import { rect } from 'common/factories/phaser';
import { Action, Animation, CollisionTag, Sprite } from 'constants';
import { collision, Collision } from 'systems/collision';
import { Input } from 'systems/input';
import { movement, Movement } from 'systems/movement';

export class Player extends Phaser.GameObjects.Container {
  private collision: Collision;

  private movement: Movement;

  private inputs: Input;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.collision = collision(this.scene, rect(-4, -4, 8, 8)).tag(CollisionTag.Player);

    this.movement = movement(this.scene, this, this.collision)
      .setSpeed(128)
      .setAcceleration(256)
      .moveWithVelocity()
      .setMovementEase(Phaser.Math.Easing.Sine.In);

    this.inputs = directionalInputs(this.scene);

    this.add(this.collision.toGameObject());

    this.add(this.scene.add.sprite(0, 0, Sprite.DebugPlayer).play(Animation.DebugPlayer));
  }

  public preUpdate(_time: number, delta: number) {
    const x = this.inputs.isActive(Action.Right) - this.inputs.isActive(Action.Left);

    const y = this.inputs.isActive(Action.Down) - this.inputs.isActive(Action.Up);

    this.movement.moveInDirection(new Phaser.Math.Vector2(x, y), delta);
  }
}
