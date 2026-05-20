import { CheckerController } from 'common/filters/checker';
import { WipeController } from 'common/filters/wipe';
import { Queue } from 'common/objects/queue';
import { Scene } from 'common/scene';
import { RunCallback } from 'common/sequences/run_callback';
import { RunTween } from 'common/sequences/run_tween';
import { Sequence } from 'common/sequences/sequence';
import { logWarn } from 'common/utils/log';
import { randomInt } from 'common/utils/math';
import { SCENE, TypeOfScene } from 'constants';

export type Transition = 'Diagonal Wipe' | 'Wipe';

export class TransitionManager extends Scene {
  private isTransitioning = false;
  private wipeController: WipeController;
  private checkerController: CheckerController;
  private queue: Queue;

  constructor() {
    super(SCENE.TransitionManager);
  }

  create() {
    const camera = this.cameras.main;

    this.wipeController = new WipeController(camera);
    this.checkerController = new CheckerController(camera);

    if (this.app().isDebug()) {
      this.app().controlNumber('Wipe Progress', this.wipeController, 'progress', 0, 1);
      this.app().controlNumber('Checker Progress', this.checkerController, 'progress', 0, 1);
    }

    camera.filters.external.add(this.wipeController);
    camera.filters.external.add(this.checkerController);

    this.queue = this.add.existing(new Queue(this));
  }

  update() {
    this.scene.bringToTop(this);
  }

  runScene(from: Scene, to: TypeOfScene) {
    this.run(() => from.scene.start(to));

    return this;
  }

  run(fn: () => void, ignoreIfRunning: boolean = false) {
    let controller = this.freshTransition();

    if (this.isTransitioning && ignoreIfRunning) {
      logWarn('Already transitioning.');

      return;
    }

    this.queue.push(
      new Sequence([
        new RunCallback(() => {
          this.isTransitioning = true;
        }),
        new RunTween(this, {
          targets: controller,
          ease: Phaser.Math.Easing.Quintic.InOut,
          duration: 600,
          props: { value: { from: 0, to: 1 } },
          onUpdate: (_tween: unknown, _target: unknown, _key: string, current: number) => {
            controller.progress = current;
          },
        }),
        new RunCallback(() => {
          fn();

          controller = this.freshTransition();

          [this.wipeController, this.checkerController].forEach((c) => {
            c.progress = c === controller ? 1 : 0;
          });
        }),
        new RunTween(this, {
          targets: controller,
          ease: Phaser.Math.Easing.Quintic.InOut,
          duration: 600,
          props: { value: { from: 1, to: 0 } },
          onUpdate: (_tween: unknown, _target: unknown, _key: string, current: number) => {
            controller.progress = current;
          },
        }),
        new RunCallback(() => {
          this.isTransitioning = false;
        }),
      ])
    );

    return this;
  }

  private freshTransition(): Phaser.Filters.Controller & { progress: number } {
    const controller = [
      // Controllers.
      this.wipeController,
      this.checkerController,
    ][randomInt(0, 1)];

    controller.randomise();

    return controller;
  }
}
