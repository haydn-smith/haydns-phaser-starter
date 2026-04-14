import { directionalInputs } from 'common/factories/input';
import { rect } from 'common/factories/phaser';
import { Action, Animation, CollisionTag, Sprite } from 'constants';
import { Collision } from './collision';
import { Input } from './input/input';
import { Movement, velocityMovement } from './movement';

export class Player extends Phaser.GameObjects.Container {
  private collision: Collision;

  private movement: Movement;

  private inputs: Input;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.collision = Collision.fromArea(this.scene, rect(-4, -4, 8, 8)).setTag(CollisionTag.Player);

    this.movement = new Movement(this.scene, this, this.collision)
      .addToUpdateList()
      .addToDisplayList()
      .setSpeed(128)
      .setAcceleration(256)
      .setMovementStrategy(velocityMovement)
      .setMovementEase(Phaser.Math.Easing.Sine.In);

    this.add(this.movement);

    this.inputs = directionalInputs(this.scene);

    this.add(this.collision);

    this.add(this.scene.add.sprite(0, 0, Sprite.DebugPlayer).play(Animation.DebugPlayer));
  }

  public preUpdate(_time: number, delta: number) {
    const x = this.inputs.isPressed(Action.Right) - this.inputs.isPressed(Action.Left);

    const y = this.inputs.isPressed(Action.Down) - this.inputs.isPressed(Action.Up);

    this.movement.moveInDirection(new Phaser.Math.Vector2(x, y), delta);
  }
}
