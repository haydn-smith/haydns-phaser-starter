import { SpatialAudio as SpatialAudioObject } from 'systems/audio/objects/spatial_audio';

export class SpatialAudio {
  constructor(private audio: SpatialAudioObject) {}

  public destroy(): void {
    this.audio.destroy();
  }

  public volume(): number {
    return this.audio.getVolume();
  }

  public isLooping(): boolean {
    return this.audio.isLooping();
  }

  public isPlaying(): boolean {
    return this.audio.isPlaying();
  }

  public loop(): SpatialAudio {
    this.audio.loop();

    return this;
  }

  public dontLoop(): SpatialAudio {
    this.audio.dontLoop();

    return this;
  }

  public play(): SpatialAudio {
    this.audio.play();

    return this;
  }

  public pause(): SpatialAudio {
    this.audio.pause();

    return this;
  }

  public stop(): SpatialAudio {
    this.audio.stop();

    return this;
  }

  public toggle(): SpatialAudio {
    this.audio.toggle();

    return this;
  }

  public setVolume(volume: number): SpatialAudio {
    this.audio.setVolume(volume);

    return this;
  }

  public setPosition(position: Phaser.Types.Math.Vector2Like): SpatialAudio {
    this.audio.withPosition(position);

    return this;
  }

  public setDistance(distance: number): SpatialAudio {
    this.audio.setDistance(distance);

    return this;
  }
}
