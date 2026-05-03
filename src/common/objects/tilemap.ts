import { rect } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { scaled } from 'common/utils/scaled';
import { TypeOfTilemap, TypeOfTileset } from 'constants';
import { Collision } from './collision';

export class Tilemap extends Phaser.GameObjects.GameObject {
  private map: Phaser.Tilemaps.Tilemap;

  private layers: Array<Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer> = [];

  private collisions: Collision[] = [];

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

  forPoints(key: string, fn: (v: Phaser.Math.Vector2) => void) {
    this.getPoints(key).forEach(fn);

    return this;
  }

  forAreas(key: string, fn: (r: Phaser.Geom.Rectangle) => void) {
    this.getAreas(key).forEach(fn);

    return this;
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

    return points.objects
      .filter((p) => p.point && p.name === key)
      .map((p) => new Phaser.Math.Vector2(p.x, p.y).multiply(new Phaser.Math.Vector2(scaled())));
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
