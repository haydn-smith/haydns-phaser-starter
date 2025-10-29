import { SpatialAudio } from 'systems/audio/decorators/spatial_audio';
import { SpatialAudio as SpatialAudioObject } from 'systems/audio/objects/spatial_audio';

export function spatialAudio(scene: Phaser.Scene, key: string) {
  return new SpatialAudio(new SpatialAudioObject(scene, key).addToUpdateList());
}
