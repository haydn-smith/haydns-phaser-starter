import { actionInput } from 'common/factories/input';
import { debugMap } from 'common/factories/tilemap';
import { Audio } from 'common/objects/audio';
import { Camera } from 'common/objects/camera';
import { Input } from 'common/objects/input/input';
import { Player } from 'common/objects/player';
import { SpatialAudio } from 'common/objects/spatial_audio';
import { Scene } from 'common/scene';
import { Action, Depth, SCENE, Sound } from 'constants';

export class Debug extends Scene {
  private player: Phaser.GameObjects.Container;

  private inputs: Input;

  private camera: Camera;

  private activate: Audio;

  private music: SpatialAudio;

  constructor() {
    super(SCENE.Debug);
  }

  create() {
    const map = debugMap(this);

    this.player = new Player(this)
      .setDepth(Depth.Main)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

    this.add.existing(this.player);

    this.inputs = this.add.existing(actionInput(this));

    this.camera = this.add.existing(new Camera(this).follow(this.player));

    this.activate = new Audio(this, Sound.Activate).dontLoop().withVolume(0.7);

    this.music = new SpatialAudio(this, Sound.Music)
      .loop()
      .setVolume(0.5)
      .withPosition(this.player)
      .setDistance(80)
      .play();
  }

  update() {
    if (this.inputs.isJustPressed(Action.Action)) {
      this.camera.zoom(Math.random() + 1, 2000);

      this.activate.play();

      this.music.toggle();

      this.camera.shake();
    }
  }
}
