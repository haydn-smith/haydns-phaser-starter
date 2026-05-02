import { directionalInputs } from 'common/factories/input';
import { rect } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { velocityMovement } from 'common/utils/movement_functions';
import { ACTION, ANIMATION, COLLISION_TAG, SPRITE } from 'constants';
import { Collision } from './collision';
import { Input } from './input/input';
import { Movement } from './movement';

export class Player extends Phaser.GameObjects.Container {
  private collision: Collision;

  private movement: Movement;

  private inputs: Input;

  constructor(public scene: Scene) {
    super(scene);

    this.collision = Collision.fromArea(this.scene, rect(-4, -4, 8, 8)).setTag(COLLISION_TAG.Player);

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

    this.add(this.scene.add.sprite(0, 0, SPRITE.DebugPlayer).play(ANIMATION.DebugPlayer));
  }

  public preUpdate(_time: number, delta: number) {
    const x = this.inputs.isPressed(ACTION.Right) - this.inputs.isPressed(ACTION.Left);

    const y = this.inputs.isPressed(ACTION.Down) - this.inputs.isPressed(ACTION.Up);

    this.movement.moveInDirection(new Phaser.Math.Vector2(x, y), delta);
  }
}
