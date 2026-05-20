import { vec2 } from 'common/factories/phaser';
import { Movement } from 'common/objects/movement';
import { Pathfinder } from 'common/objects/pathfinder';
import { Sequence } from 'common/objects/sequence';
import { Scene } from 'common/scene';
import { MoveAlongPath } from 'common/sequences/move_along_path';
import { linearMovement } from 'common/utils/movement_functions';

export class PathfinderExample extends Scene {
  constructor() {
    super('Pathfinder Example');
  }

  create() {
    // A moving dot.
    const dot = this.add.container(100, 100);
    dot.add(this.add.graphics().fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20));
    const movement = this.add.existing(new Movement(this, dot).setMovementStrategy(linearMovement));

    // Pathfinder.
    const pathfinder = this.add.existing(new Pathfinder(this));
    pathfinder
      .addGrid(vec2(100, 100), vec2(200, 700), 100)
      .addGrid(vec2(200, 500), vec2(400, 700), 100)
      .addGrid(vec2(400, 100), vec2(500, 700), 100)
      .addGrid(vec2(500, 100), vec2(700, 300), 100)
      .addGrid(vec2(700, 100), vec2(800, 700), 100)
      .addGrid(vec2(800, 500), vec2(1000, 700), 100)
      .addGrid(vec2(1000, 100), vec2(1100, 700), 100)
      .addGrid(vec2(1100, 100), vec2(1200, 300), 100);

    // Sequence.
    let sequence: Sequence | undefined;

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // We can use the pathfinder to find paths to and from points.
      const path = pathfinder.findPath(vec2(dot.x, dot.y), vec2(pointer.worldX, pointer.worldY));

      // We can use sequences to navigate items along these paths.
      sequence?.destroy();
      sequence = this.add
        .existing(new Sequence(this, [new MoveAlongPath(movement, path)]))
        .destroyWhenComplete()
        .start();
    });
  }
}
