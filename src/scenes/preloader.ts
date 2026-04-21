import { Scene } from 'common/scene';
import { Animation, Font, SCENE, Sound, Sprite, Tilemap, Tileset } from 'constants';

export class Preloader extends Scene {
  constructor() {
    super(SCENE.Preloader);
  }

  init() {
    // Ensures the loading bar is approximately the same
    // size regardless of renderer size.
    const scaled = (n: number) => n * (this.height() / 240);

    this.add
      .rectangle(this.width() / 2 - scaled(32), this.height() / 2 - scaled(2), scaled(64), scaled(1), 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(this.width() / 2 - scaled(32), this.height() / 2 + scaled(2), scaled(64), scaled(1), 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(this.width() / 2 - scaled(33), this.height() / 2 - scaled(1), scaled(1), scaled(3), 0xffffff)
      .setOrigin(0, 0);
    this.add
      .rectangle(this.width() / 2 + scaled(32), this.height() / 2 - scaled(1), scaled(1), scaled(3), 0xffffff)
      .setOrigin(0, 0);

    const bar = this.add
      .rectangle(this.width() / 2 - scaled(32), this.height() / 2 - scaled(2), scaled(0), scaled(4), 0xffffff)
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
    // TODO: A transition manager scene.
    // TODO: An audio manager scene.

    // Allow the sound to play.
    this.sound.unlock();

    // Start game.
    this.scene.start(SCENE.MainMenu);
  }
}
