import { Scene } from 'common/scene';
import { SCENE, TypeOfSound } from 'constants';

type Sound = Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.NoAudioSound;

export class SoundManager extends Scene {
  private sounds: Partial<Record<TypeOfSound, Sound>> = {};

  constructor() {
    super(SCENE.SoundManager);
  }

  shutdown() {
    Object.values(this.sounds).forEach((s) => s.destroy());
  }

  singleton(key: TypeOfSound) {
    if (!this.sounds[key]) {
      this.sounds[key] = this.sound.add(key, { loop: true, volume: 1 });
    }

    return this.sounds[key];
  }

  fade(sound: Sound, to: number, duration: number = 3000) {
    this.tweens
      .add({
        targets: sound,
        props: {
          volume: { from: sound.volume, to },
        },
        duration,
        onUpdate: (_tween, _target, _key, current) => {
          sound.setVolume(current);
        },
      })
      .play();
  }
}
