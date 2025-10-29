import { Sequence } from 'systems/sequence/decorators/sequence';
import { Sequence as SequenceObject } from 'systems/sequence/objects/sequence';

export function sequence(scene: Phaser.Scene): Sequence {
  return new Sequence(new SequenceObject(scene).addToUpdateList());
}
