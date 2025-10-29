import { actionInput } from 'common/factories/input';
import { Typewriter } from 'common/objects/typewriter';
import { logEvent } from 'common/utils/log';
import { scaled } from 'common/utils/scaled';
import { Action, Animation, Depth, Flag, Scene, Sound } from 'constants';
import { audio } from 'systems/audio';
import { camera } from 'systems/camera';
import { checkFlag, setFlag } from 'systems/flags';
import { Input } from 'systems/input';
import { runCallback, runTween, sequence, wait, waitForInput } from 'systems/sequence';
import { ui, UserInterface } from 'systems/ui';

export class MainMenu extends Phaser.Scene {
  private typewriter: Typewriter;

  private typewriter2: Typewriter;

  private inputs: Input;

  private ui: UserInterface;

  constructor() {
    super(Scene.MainMenu);
  }

  create() {
    logEvent('Creating "MainMenu" scene.');

    if (checkFlag(Flag.SkipMainMenu)) {
      this.scene.start(Scene.Debug);
    }

    this.ui = ui(this).black();

    camera(this);

    this.typewriter = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.typewriter2 = this.add.existing(new Typewriter(this)).setDepth(Depth.UI).setScrollFactor(0);

    this.inputs = actionInput(this);

    const activate = audio(this, Sound.Activate);

    sequence(this)
      .of([
        wait(1000),
        runCallback(() => this.ui.fadeIn(1000, 'Linear')),
        wait(500),
        runCallback(() => this.typewriter.typewrite(`Are you ready to begin your journey?`)),
        wait(() => this.typewriter.typewriteDuration()),
        wait(500),
        runCallback(() => this.typewriter2.typewrite(`Press [animation:${Animation.ZButton}] to start.`)),
        wait(() => this.typewriter2.typewriteDuration()),
        waitForInput(this.inputs, Action.Action),
        runCallback(() => activate.play()),
        runTween(this, {
          targets: this.typewriter,
          alpha: 0,
          duration: 400,
        }),
        runTween(this, {
          targets: this.typewriter2,
          alpha: 0,
          duration: 400,
        }),
        runCallback(() => this.ui.fadeOut(1000)),
        wait(1000),
        runCallback(() => this.scene.start(Scene.Debug)),
      ])
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
