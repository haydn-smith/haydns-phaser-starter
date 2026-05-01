import { Sequenceable } from 'common/contracts/sequenceable';
import { Scene } from 'common/scene';

export class RunTween implements Sequenceable {
  private isStarted = false;

  private isFinished = false;

  private tween;

  constructor(scene: Scene, config: Phaser.Types.Tweens.TweenChainBuilderConfig) {
    config = {
      ...config,
      paused: true,
    };

    this.tween = scene.tweens.add(config);
    this.tween.on('complete', () => {
      this.isFinished = true;
    });
  }

  public update() {
    if (!this.isStarted) {
      this.isStarted = true;

      this.tween.play();
    }
  }

  public isComplete(): boolean {
    return this.isFinished;
  }

  public reset() {
    this.isFinished = false;
    this.isStarted = false;
  }
}
