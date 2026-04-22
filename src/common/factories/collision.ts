import { Collision } from 'common/objects/collision';
import { Scene } from 'common/scene';

export function collisionBorder(scene: Scene, rect: Phaser.Geom.Rectangle): Collision[] {
  return [
    Collision.fromArea(scene, new Phaser.Geom.Rectangle(rect.x, rect.y, rect.width, 1)),
    Collision.fromArea(scene, new Phaser.Geom.Rectangle(rect.x, rect.y + rect.height, rect.width, 1)),
    Collision.fromArea(scene, new Phaser.Geom.Rectangle(rect.x, rect.y, 1, rect.height)),
    Collision.fromArea(scene, new Phaser.Geom.Rectangle(rect.x + rect.width, rect.y, 1, rect.height)),
  ];
}

export function collision(scene: Scene, rect: Phaser.Geom.Rectangle) {
  return Collision.fromArea(scene, rect);
}
