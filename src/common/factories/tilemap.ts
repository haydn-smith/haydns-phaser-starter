import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { Tilemap } from 'constants';

export function debugMap(scene: Phaser.Scene) {
  return new TilemapObject(scene, Tilemap.Debug);
}
