import { actionInput } from 'common/factories/input';
import { Audio } from 'common/objects/audio';
import { Camera } from 'common/objects/camera';
import { Input } from 'common/objects/input/input';
import { Sequence } from 'common/objects/sequence';
import { Typewriter } from 'common/objects/typewriter';
import { Scene } from 'common/scene';
import { RunCallback } from 'common/sequences/run_callback';
import { RunTween } from 'common/sequences/run_tween';
import { Wait } from 'common/sequences/wait';
import { WaitForInput } from 'common/sequences/wait_for_input';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Flag, SCENE, Sound } from 'constants';

export class MainMenu extends Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private inputs: Input;

  constructor() {
    super(SCENE.MainMenu);
  }

  create() {
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
      new RunCallback(() => this.scene.start(SCENE.Debug)),
    ])
      .addToUpdateList()
      .start()
      .destroyWhenComplete();

    this.app().setFlag(Flag.SkipMainMenu);
  }

  update() {
    this.typewriter.setPosition(this.width() / 2 - this.typewriter.typewriterWidth() / 2, this.height() / 2);

    this.typewriter2.setPosition(
      this.width() / 2 - this.typewriter2.typewriterWidth() / 2,
      this.height() / 2 + scaled(16)
    );
  }
}
