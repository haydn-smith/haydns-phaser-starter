import { Camera as CameraObject } from 'systems/camera/objects/camera';

export class Camera {
  constructor(private camera: CameraObject) {}

  public follow(target: Phaser.GameObjects.Container): Camera {
    this.camera.follow(target);

    return this;
  }

  public unfollow(): Camera {
    this.camera.unfollow();

    return this;
  }

  public pauseFollow(): Camera {
    this.camera.pauseFollow();

    return this;
  }

  public resumeFollow(): Camera {
    this.camera.resumeFollow();

    return this;
  }

  public move(position: Phaser.Math.Vector2, duration = 0): Camera {
    this.camera.move(position, duration);

    return this;
  }

  public zoom(to: number = 1, duration = 0): Camera {
    this.camera.zoom(to, duration);

    return this;
  }

  public shake(amount: number = 16, falloff: number = 16, duration = 1000, speed = 10): Camera {
    this.camera.shake(amount, falloff, duration, speed);

    return this;
  }

  public pause(): Camera {
    this.camera.pause();

    return this;
  }

  public resume(): Camera {
    this.camera.resume();

    return this;
  }

  public stay(target: Phaser.Math.Vector2): Camera {
    this.camera.static(target);

    return this;
  }

  public destroy(): void {
    this.camera.destroy();
  }
}
