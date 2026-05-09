import { rect, vec2 } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { scaled } from 'common/utils/scaled';
import { TypeOfTilemap, TypeOfTileset } from 'constants';
import { Collision } from './collision';
import { Pathfinder } from './pathfinder';

export class Tilemap extends Phaser.GameObjects.GameObject {
  private map: Phaser.Tilemaps.Tilemap;

  private layers: Array<Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer> = [];

  private collisions: Collision[] = [];

  private pathfinder: Pathfinder;

  constructor(
    public scene: Scene,
    tilemap: TypeOfTilemap,
    tileset: TypeOfTileset
  ) {
    super(scene, 'Tilemap');

    this.renderFlags = 0;

    this.map = scene.make.tilemap({ key: tilemap });

    const tiles = this.map.addTilesetImage('debug', tileset);

    if (!tiles) {
      throw new Error('No tileset found!');
    }

    this.map.layers.forEach((l) => this.layers.push(this.map.createLayer(l.name, tiles).removeFromDisplayList()));

    this.map.layers.forEach((layer) => {
      layer.tilemapLayer.setScale(scaled());
    });

    this.recalculateCollision();
  }

  preUpdate() {
    this.layers.forEach((l) => this.scene.add.existing(l));
    this.collisions.forEach((c) => this.scene.add.existing(c));
  }

  destroy() {
    this.map.destroy();
    this.layers.forEach((l) => l.destroy());
    this.collisions.forEach((c) => c.destroy());
    this.pathfinder?.destroy();
    super.destroy();
  }

  /**
   * If a tilemap layer's scale, position, or scroll factor are changed, this method can be called to update the
   * layer's collision to the new values.
   *
   * It is an expensive operation, so use it sparingly.
   */
  recalculateCollision() {
    this.collisions.forEach((c) => c.destroy());
    this.collisions = [];

    this.map.layers.forEach((layer) => {
      layer.tilemapLayer.forEachTile((tile) => {
        if (tile.properties['collision']) {
          this.collisions.push(
            Collision.fromArea(
              this.scene,
              rect(
                layer.tilemapLayer.x + tile.x * layer.tileWidth * layer.tilemapLayer.scaleX,
                layer.tilemapLayer.y + tile.y * layer.tileHeight * layer.tilemapLayer.scaleY,
                layer.tileWidth * layer.tilemapLayer.scaleX,
                layer.tileHeight * layer.tilemapLayer.scaleY
              )
            ).setScrollFactor(layer.tilemapLayer.scrollFactorX, layer.tilemapLayer.scrollFactorY)
          );
        }
      });
    });

    return this;
  }

  calculatePathfinder() {
    this.pathfinder?.destroy();
    this.pathfinder = this.scene.add.existing(new Pathfinder(this.scene));

    const nodes: Phaser.Math.Vector2[][] = [];
    this.map.layers.forEach((layer) => {
      layer.tilemapLayer.forEachTile((tile) => {
        const i = tile.x;
        const j = tile.y;

        nodes[i] = nodes[i] ?? [];

        if (tile.properties['pathfinder']) {
          const w = (layer.tileWidth * layer.tilemapLayer.scaleX) / 2;
          const h = (layer.tileHeight * layer.tilemapLayer.scaleY) / 2;

          nodes[i][j] = vec2(
            layer.tilemapLayer.x + w + tile.x * layer.tileWidth * layer.tilemapLayer.scaleX,
            layer.tilemapLayer.y + h + tile.y * layer.tileHeight * layer.tilemapLayer.scaleY
          );
        }
      });
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        const current = nodes[i][j];

        if (!current) continue;

        const up = nodes[i][j - 1];
        if (up) {
          this.pathfinder.addPath(current, up);
        }

        const left = nodes[i - 1]?.[j];
        if (left) {
          this.pathfinder.addPath(current, left);
        }

        const upLeft = nodes[i - 1]?.[j - 1];
        if (upLeft) {
          this.pathfinder.addPath(current, upLeft);
        }

        const upRight = nodes[i + 1]?.[j - 1];
        if (upRight) {
          this.pathfinder.addPath(current, upRight);
        }
      }
    }

    return this;
  }

  forPoints(key: string, fn: (v: Phaser.Math.Vector2) => void) {
    this.getPoints(key).forEach(fn);

    return this;
  }

  forAreas(key: string, fn: (r: Phaser.Geom.Rectangle) => void) {
    this.getAreas(key).forEach(fn);

    return this;
  }

  getPathfinder(): Pathfinder {
    return this.pathfinder;
  }

  getLayer(name: string): Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer | undefined {
    return this.layers.filter((l) => l.layer.name === name)[0];
  }

  getLayers(): Array<Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer> {
    return this.layers;
  }

  getPoint(key: string) {
    return this.getPoints(key)[0] ?? Phaser.Math.Vector2.ZERO;
  }

  getPoints(key: string) {
    const points = this.map.getObjectLayer('Objects');

    if (!points) return [];

    return (
      points.objects
        .filter((p) => p.point && p.name === key)
        // TODO: This object needs a scale so we can accurately get these coordinates.
        .map((p) => new Phaser.Math.Vector2(p.x, p.y).multiply(new Phaser.Math.Vector2(4)).add(vec2(200, 200)))
    );
  }

  getArea(key: string) {
    return this.getAreas(key)[0] ?? new Phaser.Geom.Rectangle(0, 0, 0, 0);
  }

  getAreas(key: string) {
    const areas = this.map.getObjectLayer('Objects');

    if (!areas) return [];

    return areas.objects
      .filter((a) => a.rectangle && a.name === key)
      .map(
        (a) =>
          new Phaser.Geom.Rectangle(scaled(a?.x ?? 0), scaled(a?.y ?? 0), scaled(a?.width ?? 0), scaled(a?.height ?? 0))
      );
  }
}
