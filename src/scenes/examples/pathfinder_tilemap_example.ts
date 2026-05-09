import { vec2 } from 'common/factories/phaser';
import { Camera } from 'common/objects/camera';
import { Collision } from 'common/objects/collision';
import { Movement } from 'common/objects/movement';
import { Tilemap } from 'common/objects/tilemap';
import { Scene } from 'common/scene';
import { linearMovement } from 'common/utils/movement_functions';
import { COLLISION_TAG, DEPTH, TILEMAP, TILESET } from 'constants';

// TODO: move_to_target does not support collision
// functions. Is there a better way to define them?
export class PathfinderTilemapExample extends Scene {
  constructor() {
    super('Pathfinder Tilemap Example');
  }

  create() {
    // A moving dot.
    const dot = this.add.container(0, 0);
    dot.add(this.add.graphics().fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20));
    const collision = this.add.existing(new Collision(this, 0, 0, 16, 16).setTag(COLLISION_TAG.PushesObjects));
    const movement = this.add.existing(new Movement(this, dot, collision).setMovementStrategy(linearMovement));
    dot.add(collision);

    // Tilemap.
    const tilemap1 = this.add.existing(new Tilemap(this, TILEMAP.Debug, TILESET.Debug));
    tilemap1.getLayer('Background')?.setDepth(DEPTH.Background).setScale(4).setPosition(200, 200);
    tilemap1.getLayer('Foreground')?.setDepth(DEPTH.Foreground).setScale(4).setPosition(200, 200);
    tilemap1.recalculateCollision();
    tilemap1.calculatePathfinder();

    dot.setPosition(tilemap1.getPoint('Player Start').x, tilemap1.getPoint('Player Start').y);

    // Camera.
    this.add.existing(new Camera(this)).follow(dot);

    // Pushable object.
    this.add
      .existing(new Collision(this, 700, 700, 100, 100))
      .setTag(COLLISION_TAG.Pushable)
      .setTag(COLLISION_TAG.PushesObjects);

    this.input.on('pointerdown', (pointer) => {
      tilemap1.getPathfinder().moveAlongPath(movement, vec2(pointer.worldX, pointer.worldY));
    });
  }

  update() {
    console.log(this.allChildren().length);
  }
}
