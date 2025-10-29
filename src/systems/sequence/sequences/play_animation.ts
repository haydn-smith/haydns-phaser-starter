import { Sequenceable } from 'systems/sequence/contracts/sequenceable';

export class PlayAnimation implements Sequenceable {
  private hasStarted = false;

  constructor(
    private sprite: Phaser.GameObjects.Sprite,
    private animation: string
  ) {}

  public update() {
    if (!this.hasStarted) {
      this.sprite.play(this.animation);

      this.hasStarted = true;
    }
  }

  public isComplete(): boolean {
    return (
      this.sprite.anims === undefined ||
      this.sprite.anims.getTotalFrames() - 1 === this.sprite.anims.currentFrame?.index
    );
  }

  public reset() {
    this.hasStarted = false;
  }
}
