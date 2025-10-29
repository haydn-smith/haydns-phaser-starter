import { MovementFn } from 'systems/movement/objects/movement';

export const linearMovement: MovementFn = (
  _currentVelocity: Phaser.Math.Vector2,
  direction: Phaser.Math.Vector2,
  _delta: number,
  speed: number
): Phaser.Math.Vector2 => {
  if (direction.equals(Phaser.Math.Vector2.ZERO)) {
    return Phaser.Math.Vector2.ZERO;
  }

  return direction.clone().normalize().multiply(new Phaser.Math.Vector2(speed));
};
