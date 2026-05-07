import { vec2 } from 'common/factories/phaser';
import { Movement } from 'common/objects/movement';
import { Pathfinder } from 'common/objects/pathfinder';
import { Scene } from 'common/scene';
import { velocityMovement } from 'common/utils/movement_functions';

// TODO: linearMovement does not stop moving when it is not
// moving in a direction.
//
// TODO: velocityMovement does not follow paths well.
//
// TODO: move_to_target does not support collision
// functions. Is there a better way to define them?
//
// TODO: moveAlongPath has code in it to support weird
// movement behaviour. We should remove it.
//
// TODO: update the A* algo to support the starting
// and ending nodes. I think this involves updating
// the h() function.
//
// TODO: Add a tilemap to this example.
export class PathfinderExample extends Scene {
  constructor() {
    super('Pathfinder Example');
  }

  create() {
    // A moving dot.
    const dot = this.add.container(this.width() / 2, this.height() / 2);
    dot.add(this.add.graphics().fillStyle(0xff0000, 0.5).fillRect(0, 0, 20, 20));
    const movement = this.add.existing(new Movement(this, dot).setMovementStrategy(velocityMovement));

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

    this.input.on('pointerdown', (pointer) => {
      pathfinder.moveAlongPath(movement, vec2(pointer.x, pointer.y));
    });
  }
}
