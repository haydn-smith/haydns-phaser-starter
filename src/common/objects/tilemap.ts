import { rect } from 'common/factories/phaser';
import { Depth, GlobalScale, Tileset, TypeOfTilemap } from 'constants';
import { collision } from 'systems/collision';

export class Tilemap extends Phaser.GameObjects.GameObject {
  private map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, tilemap: TypeOfTilemap) {
    super(scene, 'Tilemap');

    this.renderFlags = 0;

    this.map = this.scene.add.tilemap(tilemap);

    const tiles = this.map.addTilesetImage('debug', Tileset.Debug);

    if (tiles) {
      this.map.createLayer('Background', tiles)?.setDepth(Depth.Background);
      this.map.createLayer('Foreground', tiles)?.setDepth(Depth.Foreground);
    }

    this.map.layers.forEach((layer) => {
      layer.tilemapLayer.setScale(GlobalScale);

      layer.tilemapLayer.forEachTile((tile) => {
        if (tile.properties?.collision) {
          collision(
            this.scene,
            rect(
              tile.x * layer.tileWidth * layer.tilemapLayer.scaleX,
              tile.y * layer.tileHeight * layer.tilemapLayer.scaleY,
              layer.tileWidth * layer.tilemapLayer.scaleX,
              layer.tileHeight * layer.tilemapLayer.scaleY
            )
          );
        }
      });
    });
  }

  public forPoints(key: string, fn: (v: Phaser.Math.Vector2) => void): Tilemap {
    this.getPoints(key).forEach(fn);

    return this;
  }

  public getPoint(key: string): Phaser.Math.Vector2 {
    return this.getPoints(key)[0] ?? Phaser.Math.Vector2.ZERO;
  }

  public getPoints(key: string): Phaser.Math.Vector2[] {
    const points = this.map.getObjectLayer('Objects');

    if (!points) return [];

    return points.objects
      .filter((p) => p.point && p.name === key)
      .map((p) => new Phaser.Math.Vector2(p.x, p.y).multiply(new Phaser.Math.Vector2(GlobalScale)));
  }

  public forAreas(key: string, fn: (r: Phaser.Geom.Rectangle) => void): Tilemap {
    this.getAreas(key).forEach(fn);

    return this;
  }

  public getArea(key: string): Phaser.Geom.Rectangle {
    return this.getAreas(key)[0] ?? new Phaser.Geom.Rectangle(0, 0, 0, 0);
  }

  public getAreas(key: string): Phaser.Geom.Rectangle[] {
    const areas = this.map.getObjectLayer('Objects');

    if (!areas) return [];

    return areas.objects
      .filter((a) => a.rectangle && a.name === key)
      .map(
        (a) =>
          new Phaser.Geom.Rectangle(
            (a?.x ?? 0) * GlobalScale,
            (a?.y ?? 0) * GlobalScale,
            (a?.width ?? 0) * GlobalScale,
            (a?.height ?? 0) * GlobalScale
          )
      );
  }
}
