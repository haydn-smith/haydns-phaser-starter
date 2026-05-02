import { actionInput } from 'common/factories/input';
import { debugMap } from 'common/factories/tilemap';
import { Camera } from 'common/objects/camera';
import { Input } from 'common/objects/input/input';
import { Player } from 'common/objects/player';
import { SpatialAudio } from 'common/objects/spatial_audio';
import { Scene } from 'common/scene';
import { ACTION, DEPTH, SCENE, SOUND } from 'constants';

export class Debug extends Scene {
  private player: Phaser.GameObjects.Container;

  private inputs: Input;

  private camera: Camera;

  private music: SpatialAudio;

  constructor() {
    super(SCENE.Debug);
  }

  create() {
    const map = debugMap(this);

    this.player = new Player(this)
      .setDepth(DEPTH.Main)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

    this.add.existing(this.player);

    this.inputs = this.add.existing(actionInput(this));

    this.camera = this.add.existing(new Camera(this).follow(this.player));

    this.music = new SpatialAudio(this, SOUND.Music)
      .loop()
      .setVolume(0.5)
      .withPosition(this.player)
      .setDistance(80)
      .play();
  }

  update() {
    if (this.inputs.isJustPressed(ACTION.Action)) {
      this.camera.zoom(Math.random() + 1, 2000);

      this.music.toggle();

      this.camera.shake();
    }
  }
}
