import { actionInput } from 'common/factories/input';
import { debugMap } from 'common/factories/tilemap';
import { Player } from 'common/objects/player';
import { logEvent } from 'common/utils/log';
import { Action, Depth, Scene, Sound } from 'constants';
import { Audio, audio, SpatialAudio, spatialAudio } from 'systems/audio';
import { camera, Camera } from 'systems/camera';
import { Input } from 'systems/input';
import { ui, UserInterface } from 'systems/ui';

export class Debug extends Phaser.Scene {
  private ui: UserInterface;

  private player: Phaser.GameObjects.Container;

  private inputs: Input;

  private camera: Camera;

  private activate: Audio;

  private music: SpatialAudio;

  constructor() {
    super(Scene.Debug);
  }

  create() {
    logEvent('Creating "Debug" scene.');

    this.ui = ui(this).fadeIn(1000);

    const map = debugMap(this);

    this.player = new Player(this)
      .setDepth(Depth.Main)
      .setPosition(map.getPoint('Player Start').x, map.getPoint('Player Start').y);

    this.add.existing(this.player);

    this.inputs = actionInput(this);

    this.camera = camera(this).follow(this.player);

    this.activate = audio(this, Sound.Activate).dontLoop().setVolume(0.7);

    this.music = spatialAudio(this, Sound.Music).loop().setVolume(0.5).setPosition(this.player).setDistance(80).play();
  }

  update() {
    if (this.inputs.wasJustActive(Action.Action)) {
      this.camera.zoom(Math.random() + 1, 2000);

      this.ui.isLetterboxHidden() ? this.ui.showLetterbox() : this.ui.hideLetterbox();

      this.activate.play();

      this.music.toggle();

      this.camera.shake();
    }
  }
}
