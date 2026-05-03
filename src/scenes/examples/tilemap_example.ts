import { directionalInputs } from 'common/factories/input';
import { Input } from 'common/objects/input/input';
import { Tilemap } from 'common/objects/tilemap';
import { Scene } from 'common/scene';
import { ACTION, DEPTH, TILEMAP, TILESET } from 'constants';

export class TilemapExample extends Scene {
  private inputs: Input;

  constructor() {
    super('Tilemap Example');
  }

  create() {
    this.app().setDebug();

    this.inputs = this.add.existing(directionalInputs(this));

    let tilemap1: Tilemap;

    // Create the tilemap.
    this.input.keyboard?.on('keydown-A', () => {
      tilemap1 = new Tilemap(this, TILEMAP.Debug, TILESET.Debug);
    });

    // Add the tilemap to the scene.
    this.input.keyboard?.on('keydown-S', () => {
      this.add.existing(tilemap1);
    });

    // Destroy the tilemap.
    this.input.keyboard?.on('keydown-D', () => {
      tilemap1.destroy();
    });

    // Set layer properties.
    this.input.keyboard?.on('keydown-F', () => {
      tilemap1.getLayer('Background')?.setDepth(DEPTH.Background).setScale(1).setPosition(400, 400);
      tilemap1.getLayer('Foreground')?.setScrollFactor(2).setDepth(DEPTH.Foreground).setScale(2).setPosition(200, 200);
      tilemap1.recalculateCollision();
    });
  }

  update(_: number, delta: number) {
    // Allows us to see the objects in the scene.
    console.log(this.allChildren().map((o) => o.type));

    // Move the camera.
    if (this.inputs) {
      const x = this.inputs.isPressed(ACTION.Right) - this.inputs.isPressed(ACTION.Left);
      const y = this.inputs.isPressed(ACTION.Down) - this.inputs.isPressed(ACTION.Up);
      this.cameras.main.setScroll(
        this.cameras.main.scrollX + x * 100 * delta * 0.001,
        this.cameras.main.scrollY + y * 100 * delta * 0.001
      );
    }
  }
}
