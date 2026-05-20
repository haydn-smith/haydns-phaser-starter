import { vec2 } from 'common/factories/phaser';
import { Camera } from 'common/objects/camera';
import { Collision, OnCollideFnProps } from 'common/objects/collision';
import { Movement } from 'common/objects/movement';
import { Sequence } from 'common/objects/sequence';
import { Tilemap } from 'common/objects/tilemap';
import { Scene } from 'common/scene';
import { MoveAlongPath } from 'common/sequences/move_along_path';
import { linearMovement } from 'common/utils/movement_functions';
import { COLLISION_TAG, DEPTH, TILEMAP, TILESET } from 'constants';

export class PathfinderTilemapExample extends Scene {
  constructor() {
    super('Pathfinder Tilemap Example');
  }

  create() {
    // A moving dot.
    const dot = this.add.container(0, 0);
    dot.add(this.add.graphics().fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20));
    const collision = this.add.existing(new Collision(this, 0, 0, 16, 16).setTag(COLLISION_TAG.PushesObjects));
    const movement = this.add.existing(
      new Movement(this, dot, collision).setMovementStrategy(linearMovement).setOnCollide(this.onCollide)
    );
    dot.add(collision);

    // Tilemap.
    const tilemap1 = this.add.existing(new Tilemap(this, TILEMAP.Debug, TILESET.Debug));
    tilemap1.getLayer('Background')?.setDepth(DEPTH.Background);
    tilemap1.setScale(4).setPosition(200, 200);
    tilemap1.getLayer('Foreground')?.setDepth(DEPTH.Foreground);
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

    // Sequence.
    let sequence: Sequence | undefined;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // We can use the pathfinder to find paths to and from points.
      const path = tilemap1.getPathfinder()?.findPath(vec2(dot.x, dot.y), vec2(pointer.worldX, pointer.worldY));

      if (!path) {
        return;
      }

      // We can use sequences to navigate items along these paths.
      sequence?.destroy();
      sequence = this.add
        .existing(new Sequence(this, [new MoveAlongPath(movement, path)]))
        .destroyWhenComplete()
        .start();
    });
  }

  private onCollide = ({ collision, other, delta, remaining }: OnCollideFnProps) => {
    const direction = remaining.clone().normalize();

    if (other.hasTag(COLLISION_TAG.Pushable) && collision.hasTag(COLLISION_TAG.PushesObjects)) {
      other
        .getActor()
        .setPosition(
          (other.getActor().x += other.moveX(direction.x * delta * 0.001 * 100, this.onCollide)),
          (other.getActor().y += other.moveY(direction.y * delta * 0.001 * 100, this.onCollide))
        );
    }
  };
}
