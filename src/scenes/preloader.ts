import { Scene } from 'common/scene';
import { ANIMATION, FONT, SCENE, SOUND, SPRITE, TILEMAP, TILESET } from 'constants';

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
    this.load.bitmapFont(FONT.MonogramWhite, FONT.MonogramWhite, FONT.MonogramXml);
    this.load.bitmapFont(FONT.MonogramBlack, FONT.MonogramBlack, FONT.MonogramXml);
    this.load.bitmapFont(FONT.SourGummyWhite, FONT.SourGummyWhite, FONT.SourGummyXml);
    this.load.bitmapFont(FONT.SourGummyBlack, FONT.SourGummyBlack, FONT.SourGummyXml);

    // Tilemaps.
    this.load.image(TILESET.Debug, TILESET.Debug);
    this.load.tilemapTiledJSON(TILEMAP.Debug, TILEMAP.Debug);

    // Sprites.
    this.load.image(SPRITE.Black1px, SPRITE.Black1px);
    this.load.image(SPRITE.White1px, SPRITE.White1px);
    this.load.spritesheet(SPRITE.DebugPlayer, SPRITE.DebugPlayer, {
      frameWidth: 16,
    });
    this.load.spritesheet(SPRITE.ZButton, SPRITE.ZButton, {
      frameWidth: 16,
    });

    // Audio.
    this.load.audio(SOUND.Activate, SOUND.Activate);
    this.load.audio(SOUND.Music, SOUND.Music);
  }

  create() {
    // Register global animations.
    this.anims.create({
      key: ANIMATION.DebugPlayer,
      frames: SPRITE.DebugPlayer,
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: ANIMATION.ZButton,
      frames: SPRITE.ZButton,
      frameRate: 2,
      repeat: -1,
    });

    // Start management scenes.
    // TODO: A transition manager scene.
    // TODO: A parallax particles game object.
    // TODO: A pathfinder game object.
    // TODO: A "save game" feature.
    // TODO: A "Requires WebGL" check.
    // TODO: A studio logo.
    this.scene.run(SCENE.SoundManager);

    // Allow the sound to play.
    this.sound.unlock();

    // Start game.
    this.scene.start('Parallax Particles Example');
  }
}
