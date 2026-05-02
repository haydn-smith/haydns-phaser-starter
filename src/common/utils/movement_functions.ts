import { vec2 } from 'common/factories/phaser';
import { clamp } from './math';

export type MovementFnProps = {
  currentVelocity: Phaser.Math.Vector2;
  direction: Phaser.Math.Vector2;
  delta: number;
  speed: number;
  acceleration: number;
};

export type MovementFn = (props: MovementFnProps) => Phaser.Math.Vector2;

export const linearMovement: MovementFn = ({ direction, speed }): Phaser.Math.Vector2 => {
  if (direction.equals(Phaser.Math.Vector2.ZERO)) {
    return Phaser.Math.Vector2.ZERO;
  }

  // The velocity will always be the speed in the requested direction.
  return direction.clone().normalize().multiply(new Phaser.Math.Vector2(speed));
};

export const velocityMovement: MovementFn = ({
  currentVelocity,
  direction,
  delta,
  speed,
  acceleration,
}): Phaser.Math.Vector2 => {
  // If a direction is not provided we want to negate the existing velocity in order to "slow down" the actor. Unlike
  // "true" physics simulations that apply air resistance at all times, we only apply this when the actor is not
  // modifying it's own velocity in order to make the movement feel more "snappy".
  if (direction.equals(Phaser.Math.Vector2.ZERO) && !currentVelocity.equals(Phaser.Math.Vector2.ZERO)) {
    velocityMovement({
      currentVelocity,
      direction: currentVelocity.clone().negate(),
      delta,
      speed,
      acceleration,
    });
  }

  // Combine the existing velocity's direction with the direction we want to move in.
  const directionTowardsTarget = new Phaser.Math.Vector2(clamp(-1, 1, direction.x), clamp(-1, 1, direction.y))
    .clone()
    .multiply(vec2(speed, speed))
    .subtract(currentVelocity)
    .normalize();

  // Apply the direction to the existing velocity.
  const newVelocity = currentVelocity
    .clone()
    .add({
      x: directionTowardsTarget.x * acceleration * delta * 0.001,
      y: directionTowardsTarget.y * acceleration * delta * 0.001,
    })
    .limit(speed);

  // If the velocity is <5, we snap to zero to prevent jittering while the actor is stationary.
  return vec2(Math.abs(newVelocity.x) < 5 ? 0 : newVelocity.x, Math.abs(newVelocity.y) < 5 ? 0 : newVelocity.y);
};
