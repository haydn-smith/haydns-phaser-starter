import { CameraShake } from 'systems/camera/objects/camera_shake';
import { States, states } from 'systems/states';
import { ui } from 'systems/ui';

type CameraStates = 'following' | 'idle' | 'static';

export class Camera extends Phaser.GameObjects.GameObject {
  private camera: Phaser.Cameras.Scene2D.Camera;

  private target?: Phaser.GameObjects.Container;

  private targetOffset = Phaser.Math.Vector2.ZERO;

  private states: States<CameraStates, 'idle'>;

  private isFollowPaused = false;

  private position: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  private staticTarget: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

  private shaker: CameraShake;

  private previousState: CameraStates = 'idle';

  constructor(scene: Phaser.Scene) {
    super(scene, 'Camera Controller');

    this.addToUpdateList();

    this.camera = scene.cameras.main;
    this.camera.setScene(scene);
    this.camera.roundPixels = true;

    this.shaker = new CameraShake(scene);

    this.states = states<CameraStates, 'idle'>(scene, 'idle')
      .add('following', ({ delta }) => {
        if (this.isFollowPaused || !this.target) return;

        const d = this.target.getWorldTransformMatrix().decomposeMatrix();

        const target = new Phaser.Math.Vector2(d.translateX, d.translateY).add(this.targetOffset);

        const lerp = new Phaser.Math.Vector2(this.position.x, this.position.y).lerp(target, 2 * delta * 0.001);

        this.position = new Phaser.Math.Vector2(lerp.x, lerp.y);
      })
      .add('static', ({ delta }) => {
        if (!this.staticTarget) return;

        const lerp = new Phaser.Math.Vector2(this.position.x, this.position.y).lerp(
          this.staticTarget,
          2 * delta * 0.001
        );

        this.position = new Phaser.Math.Vector2(lerp.x, lerp.y);
      });
  }

  public preUpdate() {
    this.camera.setScroll(
      Math.floor(this.position.x + this.shaker.shakeOffset().x - this.scene.renderer.width / 2),
      Math.floor(this.position.y + this.shaker.shakeOffset().y - this.scene.renderer.height / 2)
    );

    ui(this.scene).debug('camera state', this.states.current());
  }

  public follow(target: Phaser.GameObjects.Container, targetOffset = Phaser.Math.Vector2.ZERO): Camera {
    this.target = target;

    this.targetOffset = targetOffset;

    this.position = new Phaser.Math.Vector2(target.x + targetOffset.x, target.y + targetOffset.y);

    this.states.change('following');

    return this;
  }

  public pauseFollow(): Camera {
    this.states.change('idle');

    return this;
  }

  public resumeFollow(): Camera {
    this.states.change('following');

    return this;
  }

  public unfollow(): Camera {
    this.states.change('idle');

    this.target = undefined;

    return this;
  }

  public move(position: Phaser.Math.Vector2, duration = 1000): Camera {
    if (this.target) {
      this.pauseFollow();
    }

    this.scene.tweens.add({
      targets: this.position,
      ease: 'Cubic',
      duration,
      props: {
        x: { to: position.x, from: this.position.x },
        y: { to: position.y, from: this.position.y },
      },
    });

    return this;
  }

  public zoom(to: number, duration = 800): Camera {
    if (to === 0) return this;

    if (duration === 0) {
      this.camera.zoom = to;

      return this;
    }

    this.camera.scene.tweens.add({
      targets: this.camera,
      ease: 'Cubic',
      duration,
      props: {
        zoomX: { to, from: this.camera.zoomX },
        zoomY: { to, from: this.camera.zoomY },
      },
    });

    return this;
  }

  public shake(amount = 16, falloff = 16, duration = 1000, speed = 10): Camera {
    this.shaker.shake(amount, falloff, duration, speed);

    return this;
  }

  public getPhaserCamera(): Phaser.Cameras.Scene2D.Camera {
    return this.camera;
  }

  public static(target: Phaser.Math.Vector2): Camera {
    this.states.change('static');

    this.staticTarget = target;

    return this;
  }

  public pause(): Camera {
    this.previousState = this.states.current();

    this.states.change('idle');

    return this;
  }

  public resume(): Camera {
    this.states.change(this.previousState);

    return this;
  }

  public setShaders(shaders: string[]): Camera {
    this.camera.setPostPipeline(shaders);

    return this;
  }
}
