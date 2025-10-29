import { KeyboardInput } from 'systems/input/objects/keyboard_input';

export function keyboardInput(scene: Phaser.Scene, key: string | number) {
  return new KeyboardInput(scene, key).addToUpdateList();
}
