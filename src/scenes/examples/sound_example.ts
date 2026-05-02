import { Scene } from 'common/scene';
import { SOUND } from 'constants';

export class SoundExample extends Scene {
  constructor() {
    super('Sound Example');
  }

  create() {
    // Play a single one-shot sound. This sound is created, played, then destroyed.
    this.input.keyboard?.on('keydown-A', () => {
      this.sound.play(SOUND.Activate);
    });

    // Register/retrieve a souund singleton. This is a sound that exists only once in the game, persists between scenes,
    // and can not be played over the top of itself. Good for ambience, and music. It is never destroyed, unless the
    // scene manager is shut down.
    const singletonSound = this.soundManager().singleton(SOUND.Activate);

    // Play the sound once.
    this.input.keyboard?.on('keydown-Q', () => {
      singletonSound.setLoop(false).play();
    });

    // Play the sound on a loop.
    this.input.keyboard?.on('keydown-W', () => {
      singletonSound.setLoop(true).play();
    });

    // Stop the sound. This will stop the sound even in the scene has been shutdown and restarted.
    this.input.keyboard?.on('keydown-E', () => {
      singletonSound.stop();
    });

    // Set the volume.
    this.input.keyboard?.on('keydown-R', () => {
      singletonSound.setVolume(0.2);
    });

    // Set the volume.
    this.input.keyboard?.on('keydown-T', () => {
      singletonSound.setVolume(1);
    });

    // Fade the volume.
    this.input.keyboard?.on('keydown-Y', () => {
      this.soundManager().fade(singletonSound, 0.2, 1000);
    });

    // Fade the volume.
    this.input.keyboard?.on('keydown-U', () => {
      this.soundManager().fade(singletonSound, 1, 1000);
    });

    // Restart the scene. Notice that the singleton sound is not destroyed, and continues playing when when this scene
    // is shut down.
    this.input.keyboard?.on('keydown-I', () => {
      this.scene.start('Sound Example');
    });
  }

  update() {
    // Shows all the registered sounds in the game.
    console.log(this.sound.getAll(SOUND.Activate).map((o) => o.key));
  }
}
