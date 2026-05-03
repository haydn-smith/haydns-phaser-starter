import { rect } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { scaled } from 'common/utils/scaled';
import { DEPTH, TypeOfTilemap, TypeOfTileset } from 'constants';
import { Collision } from './collision';

export class Tilemap extends Phaser.GameObjects.GameObject {
  private map: Phaser.Tilemaps.Tilemap;

  private layers: Array<Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer> = [];

  private collisions: Collision[] = [];

  constructor(
    public scene: Scene,
    tilemap: TypeOfTilemap,
    tileset: TypeOfTileset,
    forEachTile?: (tile: Phaser.Tilemaps.Tile) => void
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

      // TODO: Allow modification of these.
      layer.tilemapLayer.setScale(2);
      layer.tilemapLayer.setPosition(100, 100);
      layer.tilemapLayer.setDepth(DEPTH.Background);
      layer.tilemapLayer.setScrollFactor(1);

      layer.tilemapLayer.forEachTile((tile) => {
        forEachTile?.(tile);

        if (tile.properties?.collision) {
          this.collisions.push(
            Collision.fromArea(
              this.scene,
              rect(
                tile.x * layer.tileWidth * layer.tilemapLayer.scaleX,
                tile.y * layer.tileHeight * layer.tilemapLayer.scaleY,
                layer.tileWidth * layer.tilemapLayer.scaleX,
                layer.tileHeight * layer.tilemapLayer.scaleY
              )
            )
          );
        }
      });
    });
  }

  preUpdate() {
    this.layers.forEach((l) => this.scene.add.existing(l));
    this.collisions.forEach((c) => this.scene.add.existing(c));
  }

  destroy() {
    this.map.destroy();
    this.layers.forEach((l) => l.destroy());
    this.collisions.forEach((c) => c.destroy());
    super.destroy();
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
      .map((p) => new Phaser.Math.Vector2(p.x, p.y).multiply(new Phaser.Math.Vector2(scaled())));
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
          new Phaser.Geom.Rectangle(scaled(a?.x ?? 0), scaled(a?.y ?? 0), scaled(a?.width ?? 0), scaled(a?.height ?? 0))
      );
  }
}
