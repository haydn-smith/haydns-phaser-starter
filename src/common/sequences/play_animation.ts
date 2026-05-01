import { Sequenceable } from 'common/contracts/sequenceable';

export class PlayAnimation implements Sequenceable {
  private hasStarted = false;

  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private animation: string
  ) {}

  update() {
    if (!this.hasStarted) {
      this.sprite.play(this.animation);

      this.hasStarted = true;
    }
  }

  isComplete() {
    return (
      this.sprite.anims === undefined ||
      this.sprite.anims.getTotalFrames() - 1 === this.sprite.anims.currentFrame?.index
    );
  }

  reset() {
    this.hasStarted = false;
  }
}
