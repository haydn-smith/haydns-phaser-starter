export class Fader extends Phaser.GameObjects.Container {
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.addToUpdateList();

    this.graphics = this.scene.add.graphics();

    this.add(this.graphics);

    this.setScrollFactor(0).setAlpha(0);
  }

  public preUpdate() {
    this.graphics
      .setDepth(this.depth)
      .clear()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.scene.game.renderer.width, this.scene.game.renderer.height);
  }

  public fadeIn(duration: number = 800, ease: string = 'Quadratic.InOut'): Fader {
    this.scene.tweens.add({
      targets: this,
      ease,
      duration,
      props: { alpha: { from: 1, to: 0 } },
    });

    return this;
  }

  public fadeOut(duration: number = 800, ease: string = 'Quadratic.InOut'): Fader {
    this.scene.tweens.add({
      targets: this,
      ease,
      duration,
      props: { alpha: { from: 0, to: 1 } },
    });
    return this;
  }

  public setFade(alpha: number): Fader {
    this.setAlpha(alpha);

    return this;
  }
}
