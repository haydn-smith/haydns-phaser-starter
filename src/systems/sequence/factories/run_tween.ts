import { RunTween } from 'systems/sequence/sequences/run_tween';

export function runTween(scene: Phaser.Scene, config: Phaser.Types.Tweens.TweenChainBuilderConfig): RunTween {
  return new RunTween(scene, config);
}
