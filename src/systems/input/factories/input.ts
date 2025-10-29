import { Input } from 'systems/input/decorators/input';
import { Input as InputObject } from 'systems/input/objects/input';

export function input(scene: Phaser.Scene) {
  return new Input(new InputObject(scene));
}
