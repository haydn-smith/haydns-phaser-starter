import { clamp, normalize } from 'common/utils/math';
import { debugDepth, isDebug } from 'systems/flags';

export class SpatialAudio extends Phaser.GameObjects.Container {
  private sound: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

  private graphics: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    key: string,
    private distance: number = 100,
    private volume = 1
  ) {
    super(scene);

    this.sound = this.scene.sound.add(key);

    this.graphics = this.scene.add.graphics();
  }

  public preUpdate() {
    const d = this.getWorldTransformMatrix().decomposeMatrix();

    if (isDebug()) {
      this.graphics.setDepth(debugDepth()).fillStyle(0xff0000, 1).fillPoint(d.translateX, d.translateY, 2);
    }

    if (!this.sound.isPlaying) {
      return;
    }

    const camera = this.scene.cameras.main;

    const distanceTo = new Phaser.Math.Vector2(
      camera.scrollX + this.scene.renderer.width / 2,
      camera.scrollY + this.scene.renderer.height / 2
    );

    const distanceFrom = new Phaser.Math.Vector2(d.translateX, d.translateY);

    const volume = clamp(0, 1, normalize(0, this.distance, distanceFrom.distance(distanceTo)));

    this.sound.setVolume((1 - volume) * this.volume);
  }

  public destroy(fromScene?: boolean): void {
    this.sound.destroy();

    this.graphics.destroy();

    super.destroy(fromScene);
  }

  public getVolume(): number {
    return this.volume;
  }

  public isLooping(): boolean {
    return this.sound.loop;
  }

  public isPlaying(): boolean {
    return this.sound.isPlaying;
  }

  public withPosition(position: Phaser.Types.Math.Vector2Like) {
    this.setPosition(position.x, position.y);

    return this;
  }

  public setDistance(distance: number) {
    this.distance = distance;

    return this;
  }

  public loop() {
    this.sound.setLoop(true);

    return this;
  }

  public dontLoop() {
    this.sound.setLoop(false);

    return this;
  }

  public play() {
    this.sound.isPaused ? this.sound.resume() : this.sound.play();

    return this;
  }

  public pause() {
    this.sound.pause();

    return this;
  }

  public toggle() {
    return this.sound.isPlaying ? this.pause() : this.play();
  }

  public stop() {
    this.sound.setSeek(0).stop();

    return this;
  }

  public setVolume(volume: number) {
    this.volume = volume;

    return this;
  }
}
