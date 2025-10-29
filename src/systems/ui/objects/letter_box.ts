export class Letterbox extends Phaser.GameObjects.Container {
  private topBar: Phaser.GameObjects.Graphics;

  private bottomBar: Phaser.GameObjects.Graphics;

  private isVisible: boolean = false;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.addToUpdateList();

    this.topBar = this.scene.add.graphics().setPosition(0, -this.scene.game.renderer.height / 6);

    this.add(this.topBar);

    this.bottomBar = this.scene.add.graphics().setPosition(0, this.scene.game.renderer.height / 6);

    this.add(this.bottomBar);

    this.setScrollFactor(0);
  }

  public preUpdate() {
    this.topBar
      .setDepth(this.depth)
      .clear()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.scene.game.renderer.width, this.scene.game.renderer.height / 6);

    this.bottomBar
      .setDepth(this.depth)
      .clear()
      .fillStyle(0x000000, 1)
      .fillRect(
        0,
        this.scene.game.renderer.height - this.scene.game.renderer.height / 6,
        this.scene.game.renderer.width,
        this.scene.game.renderer.height / 6
      );
  }

  public show(): Letterbox {
    this.scene.tweens.add({
      targets: this.topBar,
      ease: 'Cubic',
      duration: 800,
      props: { y: { from: -this.scene.game.renderer.height / 6, to: 0 } },
    });

    this.scene.tweens.add({
      targets: this.bottomBar,
      ease: 'Cubic',
      duration: 800,
      props: { y: { from: this.scene.game.renderer.height / 6, to: 0 } },
    });

    this.isVisible = true;

    return this;
  }

  public hide(): Letterbox {
    this.scene.tweens.add({
      targets: this.topBar,
      ease: 'Cubic',
      duration: 800,
      props: { y: { from: 0, to: -this.scene.game.renderer.height / 6 } },
    });

    this.scene.tweens.add({
      targets: this.bottomBar,
      ease: 'Cubic',
      duration: 800,
      props: { y: { from: 0, to: this.scene.game.renderer.height / 6 } },
    });

    this.isVisible = false;

    return this;
  }

  public isShown(): boolean {
    return this.isVisible;
  }

  public isHidden(): boolean {
    return !this.isShown();
  }
}
