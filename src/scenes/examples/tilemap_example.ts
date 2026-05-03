import { Tilemap } from 'common/objects/tilemap';
import { Scene } from 'common/scene';
import { TILEMAP, TILESET } from 'constants';

export class TilemapExample extends Scene {
  constructor() {
    super('Tilemap Example');
  }

  create() {
    this.app().setDebug();

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

    // TODO: Example of tileset with mutliple layers:
    //   * Set depth of each layer.
    //   * Set scale of each layer.
    //   * Set position of each layer.
    //   * Set scroll factor of each layer.
  }

  update() {
    // Allows us to see the objects in the scene.
    console.log(this.allChildren().map((o) => o.type));
  }
}
