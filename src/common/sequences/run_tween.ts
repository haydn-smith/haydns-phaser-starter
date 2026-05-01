import { Sequenceable } from 'common/contracts/sequenceable';
import { Scene } from 'common/scene';

export class RunTween implements Sequenceable {
  private isStarted = false;

  private isFinished = false;

  constructor(
    private scene: Scene,
    private config: Phaser.Types.Tweens.TweenChainBuilderConfig
  ) {
    config = {
      ...config,
      paused: true,
    };
  }

  update() {
    if (!this.isStarted) {
      this.isStarted = true;

      this.scene.tweens
        .add(this.config)
        .on('complete', () => {
          this.isFinished = true;
        })
        .play();
    }
  }

  isComplete() {
    return this.isFinished;
  }

  reset() {
    this.isFinished = false;
    this.isStarted = false;
  }
}
