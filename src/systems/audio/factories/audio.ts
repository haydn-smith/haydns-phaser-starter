import { Audio } from 'systems/audio/decorators/audio';
import { Audio as AudioObject } from 'systems/audio/objects/audio';

export function audio(scene: Phaser.Scene, key: string): Audio {
  return new Audio(new AudioObject(scene, key).addToUpdateList());
}
