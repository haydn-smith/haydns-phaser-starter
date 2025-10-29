export class Audio extends Phaser.GameObjects.GameObject {
  private sound: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

  constructor(scene: Phaser.Scene, key: string) {
    super(scene, 'spatial_audio');

    this.renderFlags = 0;

    this.sound = this.scene.sound.add(key);
  }

  public destroy(fromScene?: boolean): void {
    this.sound.destroy();

    super.destroy(fromScene);
  }

  public volume(): number {
    return this.sound.volume;
  }

  public isLooping(): boolean {
    return this.sound.loop;
  }

  public isPlaying(): boolean {
    return this.sound.isPlaying;
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
    this.sound.play();

    return this;
  }

  public pause() {
    this.sound.pause();

    return this;
  }

  public stop() {
    this.sound.setSeek(0).stop();

    return this;
  }

  public toggle() {
    return this.sound.isPlaying ? this.pause() : this.play();
  }

  public withVolume(volume: number) {
    this.sound.setVolume(volume);

    return this;
  }
}
