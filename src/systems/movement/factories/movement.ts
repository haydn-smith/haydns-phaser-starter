import { Collision } from 'systems/collision';
import { Movement } from 'systems/movement/decorators/movement';
import { Movement as MovementObject } from 'systems/movement/objects/movement';

export function movement(scene: Phaser.Scene, actor: Phaser.GameObjects.Container, collision: Collision): Movement {
  return new Movement(new MovementObject(scene, actor, collision).addToUpdateList());
}
