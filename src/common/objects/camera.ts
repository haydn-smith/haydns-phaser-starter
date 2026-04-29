import { Scene } from 'common/scene';
import { logWarn } from 'common/utils/log';
import { States } from 'common/utils/states';
import { worldPosition } from 'common/utils/worldPosition';
import { CameraShake } from './camera_shake';

type CameraStates = 'following' | 'free';

export class Camera extends Phaser.GameObjects.GameObject {
  private camera: Phaser.Cameras.Scene2D.Camera;

  private target?: Phaser.GameObjects.Container;

  private targetOffset = Phaser.Math.Vector2.ZERO;

  private states: States<CameraStates, 'free'>;

  private isFollowPaused = false;

  private position: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  private shaker: CameraShake;

  constructor(public scene: Scene) {
    super(scene, 'Camera');

    this.camera = scene.cameras.main;
    this.camera.setScene(scene).setOrigin(0.5, 0.5);

    this.shaker = new CameraShake(scene);

    this.states = new States<CameraStates, 'free'>(scene, 'free').add('following', ({ delta }) => {
      if (this.isFollowPaused || !this.target) return;

      const target = worldPosition(this.target).add(this.targetOffset);

      this.position = this.position.clone().lerp(target, 2 * delta * 0.001);
    });

    this.on('destroy', () => {
      this.shaker.destroy();
    });
  }

  preUpdate(_: number, delta: number) {
    this.scene.add.existing(this.shaker);

    this.states.step(delta);

    this.camera.setScroll(
      this.position.x - this.scene.halfWidth() + this.shaker.shakeOffset().x,
      this.position.y - this.scene.halfHeight() + this.shaker.shakeOffset().y
    );
  }

  isFollowing() {
    return this.states.current() === 'following';
  }

  follow(target: Phaser.GameObjects.Container, { targetOffset = Phaser.Math.Vector2.ZERO, snapToTarget = true } = {}) {
    this.target = target;

    this.targetOffset = targetOffset;

    if (snapToTarget) {
      this.position = new Phaser.Math.Vector2(target.x + targetOffset.x, target.y + targetOffset.y);
    }

    this.states.change('following');

    return this;
  }

  pauseFollow() {
    if (!this.target) {
      logWarn('No target to pause following.');

      return this;
    }

    this.states.change('free');

    return this;
  }

  resumeFollow() {
    if (!this.target) {
      logWarn('No target to resume following.');

      return this;
    }

    this.states.change('following');

    return this;
  }

  unfollow() {
    this.states.change('free');

    this.target = undefined;

    return this;
  }

  move(position: Phaser.Math.Vector2, duration = 0) {
    if (this.target) {
      this.pauseFollow();
    }

    if (duration === 0) {
      this.position = position;

      return this;
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

  zoom(to: number, duration = 0) {
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

  shake(amount = 16, falloff = 16, duration = 1000, speed = 10) {
    this.shaker.shake(amount, falloff, duration, speed);

    return this;
  }
}
