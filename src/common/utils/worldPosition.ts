import { vec2 } from 'common/factories/phaser';

export const worldPosition = (object: Phaser.GameObjects.Container): Phaser.Math.Vector2 => {
  const d = object.getWorldTransformMatrix().decomposeMatrix();

  return vec2(d.translateX, d.translateY);
};

export const worldScale = (object: Phaser.GameObjects.Container): Phaser.Math.Vector2 => {
  const d = object.getWorldTransformMatrix().decomposeMatrix();

  return vec2(d.scaleX, d.scaleY);
};
