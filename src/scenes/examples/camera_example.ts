import { vec2 } from 'common/factories/phaser';
import { Camera } from 'common/objects/camera';
import { Sequence } from 'common/objects/sequence';
import { Scene } from 'common/scene';
import { RunTween } from 'common/sequences/run_tween';
import { randomFloat, randomInt } from 'common/utils/math';

export class CameraExample extends Scene {
  constructor() {
    super(`Camera Example`);
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1).fillRect(this.width() / 2, this.height() / 2, 20, 20);

    const container = this.add.container(this.width() / 2, this.height() / 2);
    const graphics2 = this.add.graphics();
    container.add(graphics2);
    graphics2.fillStyle(0xff0000, 1).fillRect(0, 0, 20, 20);
    this.add.existing(
      new Sequence(this, [
        new RunTween(this, {
          targets: container,
          x: this.width() / 2 + 100,
          y: this.height() / 2 + 100,
          duration: 1000,
        }),
        new RunTween(this, {
          targets: container,
          x: this.width() / 2 + 100,
          y: this.height() / 2 - 100,
          duration: 1000,
        }),
        new RunTween(this, {
          targets: container,
          x: this.width() / 2 - 100,
          y: this.height() / 2 - 100,
          duration: 1000,
        }),
        new RunTween(this, {
          targets: container,
          x: this.width() / 2 - 100,
          y: this.height() / 2 + 100,
          duration: 1000,
        }),
      ])
        .start()
        .repeat()
    );

    const camera = this.add.existing(new Camera(this)).move(vec2(this.halfWidth(), this.halfHeight()));

    this.app().controlCallback(`Shake`, () => {
      camera.shake();
    });

    this.app().controlCallback(`Move`, () => {
      camera.move(vec2(100 * randomInt(-1, 1) + this.halfWidth(), 100 * randomInt(-1, 1) + this.halfHeight()), 3000);
    });

    this.app().controlCallback(`Follow`, () => {
      camera.isFollowing() ? camera.unfollow() : camera.follow(container, { snapToTarget: false });
    });

    this.app().controlCallback(`Follow (Snap to Target)`, () => {
      camera.isFollowing() ? camera.unfollow() : camera.follow(container, { snapToTarget: true });
    });

    this.app().controlCallback(`Follow (With Offset)`, () => {
      camera.isFollowing()
        ? camera.unfollow()
        : camera.follow(container, { snapToTarget: false, targetOffset: vec2(0, -100) });
    });

    this.app().controlCallback(`Pause/Resume Follow`, () => {
      camera.isFollowing() ? camera.pauseFollow() : camera.resumeFollow();
    });

    this.app().controlCallback(`Zoom`, () => {
      camera.zoom(randomFloat(0.5, 2), 1000);
    });
  }
}
