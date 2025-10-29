import { Collision } from 'systems/collision/decorators/collision';
import { Collision as CollisionObject } from 'systems/collision/objects/collision';

export function collision(scene: Phaser.Scene, rect: Phaser.Geom.Rectangle) {
  return new Collision(CollisionObject.fromArea(scene, rect).addToDisplayList().addToUpdateList());
}
