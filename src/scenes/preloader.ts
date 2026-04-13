import { Antialias } from 'common/objects/shaders/anti_alias';
import { Glow } from 'common/objects/shaders/glow';
import { Noise } from 'common/objects/shaders/noise';
import { SoftLight } from 'common/objects/shaders/soft_light';
import { Vignette } from 'common/objects/shaders/vignette';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Animation, Depth, Font, Scene, Shader, Sound, Sprite, Tilemap, Tileset } from 'constants';
import { startUI } from 'systems/ui';

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 - scaled(2),
        scaled(64),
        scaled(1),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 + scaled(2),
        scaled(64),
        scaled(1),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 - scaled(33),
        this.renderer.height / 2 - scaled(1),
        scaled(1),
        scaled(3),
        0xffffff
      )
      .setOrigin(0, 0);
    this.add
      .rectangle(
        this.renderer.width / 2 + scaled(32),
        this.renderer.height / 2 - scaled(1),
        scaled(1),
        scaled(3),
        0xffffff
      )
      .setOrigin(0, 0);

    const bar = this.add
      .rectangle(
        this.renderer.width / 2 - scaled(32),
        this.renderer.height / 2 - scaled(2),
        scaled(0),
        scaled(4),
        0xffffff
      )
      .setOrigin(0, 0);

    this.load.on('progress', (progress: number) => {
      bar.width = progress * scaled(64);
    });
  }

  preload() {
    this.load.setPath('assets');

    // Fonts.
    this.load.bitmapFont(Font.DefaultWhite, Font.DefaultWhite, Font.DefaultXml);
    this.load.bitmapFont(Font.DefaultBlack, Font.DefaultBlack, Font.DefaultXml);

    // Tilemaps.
    this.load.image(Tileset.Debug, Tileset.Debug);
    this.load.tilemapTiledJSON(Tilemap.Debug, Tilemap.Debug);

    // Sprites.
    this.load.image(Sprite.Black1px, Sprite.Black1px);
    this.load.image(Sprite.White1px, Sprite.White1px);
    this.load.spritesheet(Sprite.DebugPlayer, Sprite.DebugPlayer, {
      frameWidth: 16,
    });
    this.load.spritesheet(Sprite.ZButton, Sprite.ZButton, {
      frameWidth: 16,
    });

    // Audio.
    this.load.audio(Sound.Activate, Sound.Activate);
    this.load.audio(Sound.Music, Sound.Music);
  }

  create() {
    logEvent('Creating "Preloader" scene.');

    // Register global shaders.
    // if (this.sys.renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer) {
    //   this.sys.renderer.pipelines.addPostPipeline(Shader.Glow, Glow);
    //   this.sys.renderer.pipelines.addPostPipeline(Shader.Vignette, Vignette);
    //   this.sys.renderer.pipelines.addPostPipeline(Shader.Noise, Noise);
    //   this.sys.renderer.pipelines.addPostPipeline(Shader.SoftLight, SoftLight);
    //   this.sys.renderer.pipelines.addPostPipeline(Shader.AntiAlias, Antialias);
    // }

    // Register global animations.
    this.anims.create({
      key: Animation.DebugPlayer,
      frames: Sprite.DebugPlayer,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: Animation.ZButton,
      frames: Sprite.ZButton,
      frameRate: 2,
      repeat: -1,
    });

    // Start management scenes.
    startUI(this, {
      depth: Depth.UI,
      debugFont: Font.DefaultWhite,
    });

    // Allow the sound to play.
    this.sound.unlock();

    // Start game.
    this.scene.start(Scene.MainMenu);
  }
}
