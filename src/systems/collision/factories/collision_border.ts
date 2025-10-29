import { Collision } from 'systems/collision/decorators/collision';
import { collision } from 'systems/collision/factories/collision';

export function collisionBorder(scene: Phaser.Scene, rect: Phaser.Geom.Rectangle): Collision[] {
  return [
    collision(scene, new Phaser.Geom.Rectangle(rect.x, rect.y, rect.width, 1)),
    collision(scene, new Phaser.Geom.Rectangle(rect.x, rect.y + rect.height, rect.width, 1)),
    collision(scene, new Phaser.Geom.Rectangle(rect.x, rect.y, 1, rect.height)),
    collision(scene, new Phaser.Geom.Rectangle(rect.x + rect.width, rect.y, 1, rect.height)),
  ];
}
