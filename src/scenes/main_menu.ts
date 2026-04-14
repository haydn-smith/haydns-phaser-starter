import { actionInput } from 'common/factories/input';
import { Audio } from 'common/objects/audio';
import { Camera } from 'common/objects/camera';
import { Input } from 'common/objects/input/input';
import { Sequence } from 'common/objects/sequence';
import { Typewriter } from 'common/objects/typewriter';
import { RunCallback } from 'common/sequences/run_callback';
import { RunTween } from 'common/sequences/run_tween';
import { Wait } from 'common/sequences/wait';
import { WaitForInput } from 'common/sequences/wait_for_input';
import { setFlag } from 'common/utils/flags';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Flag, Scene, Sound } from 'constants';

export class MainMenu extends Phaser.Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private inputs: Input;

  constructor() {
    super(Scene.MainMenu);
  }

  create() {
    logEvent('Creating "MainMenu" scene.');

    // if (checkFlag(Flag.SkipMainMenu)) {
    //   this.scene.start(Scene.Debug);
    // }

    this.add.existing(new Camera(this));

    this.typewriter = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.typewriter2 = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.inputs = actionInput(this);

    const activate = new Audio(this, Sound.Activate);

    new Sequence(this, [
      new Wait(1000),
      new RunCallback(() => this.typewriter.typewrite(`Are you ready to begin your journey?`)),
      new Wait(() => this.typewriter.typewriteDuration()),
      new Wait(500),
      new RunCallback(() => this.typewriter2.typewrite(`Press [animation:${Animation.ZButton}] to start.`)),
      new Wait(() => this.typewriter2.typewriteDuration()),
      new WaitForInput(this.inputs, Action.Action),
      new RunCallback(() => activate.play()),
      new RunTween(this, {
        targets: this.typewriter,
        alpha: 0,
        duration: 400,
      }),
      new RunTween(this, {
        targets: this.typewriter2,
        alpha: 0,
        duration: 400,
      }),
      new Wait(1000),
      new RunCallback(() => this.scene.start(Scene.Debug)),
    ])
      .addToUpdateList()
      .start()
      .destroyWhenComplete();

    setFlag(Flag.SkipMainMenu);
  }

  update() {
    this.typewriter.setPosition(
      this.renderer.width / 2 - this.typewriter.typewriterWidth() / 2,
      this.renderer.height / 2
    );

    this.typewriter2.setPosition(
      this.renderer.width / 2 - this.typewriter2.typewriterWidth() / 2,
      this.renderer.height / 2 + scaled(16)
    );
  }
}
