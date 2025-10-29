import { PlayAnimation } from 'systems/sequence/sequences/play_animation';

export function playAnimation(sprite: Phaser.GameObjects.Sprite, animation: string): PlayAnimation {
  return new PlayAnimation(sprite, animation);
}
