import { Tilemap as TilemapObject } from 'common/objects/tilemap';
import { Scene } from 'common/scene';
import { TILEMAP } from 'constants';

export function debugMap(scene: Scene) {
  return new TilemapObject(scene, TILEMAP.Debug);
}
