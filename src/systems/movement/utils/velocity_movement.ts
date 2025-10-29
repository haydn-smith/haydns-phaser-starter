import { vec2 } from 'common/factories/phaser';
import { clamp } from 'common/utils/math';
import { MovementFn } from 'systems/movement/objects/movement';

export const velocityMovement: MovementFn = (
  currentVelocity: Phaser.Math.Vector2,
  direction: Phaser.Math.Vector2,
  delta: number,
  speed = 200,
  acceleration = 800
): Phaser.Math.Vector2 => {
  if (direction.equals(Phaser.Math.Vector2.ZERO)) {
    return currentVelocity;
  }

  const directionTowardsTarget = new Phaser.Math.Vector2(clamp(-1, 1, direction.x), clamp(-1, 1, direction.y))
    .clone()
    .multiply(vec2(speed, speed))
    .subtract(currentVelocity)
    .normalize();

  return currentVelocity
    .clone()
    .add({
      x: directionTowardsTarget.x * acceleration * delta * 0.001,
      y: directionTowardsTarget.y * acceleration * delta * 0.001,
    })
    .limit(speed);
};
