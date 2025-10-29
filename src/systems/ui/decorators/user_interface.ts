import { UserInterface as UserInterfaceScene } from 'systems/ui/scenes/user_interface';

export class UserInterface {
  constructor(private ui: UserInterfaceScene) {}

  public black(): UserInterface {
    this.ui.getFader().setFade(1);

    return this;
  }

  public fadeIn(duration: number = 800, ease: string = 'Quadratic.InOut'): UserInterface {
    this.ui.getFader().fadeIn(duration, ease);

    return this;
  }

  public fadeOut(duration: number = 800, ease: string = 'Quadratic.InOut'): UserInterface {
    this.ui.getFader().fadeOut(duration, ease);

    return this;
  }

  public isLetterboxShown(): boolean {
    return this.ui.getLetterbox().isShown();
  }

  public showLetterbox(): UserInterface {
    this.ui.getLetterbox().show();

    return this;
  }

  public isLetterboxHidden(): boolean {
    return this.ui.getLetterbox().isHidden();
  }

  public hideLetterbox(): UserInterface {
    this.ui.getLetterbox().hide();

    return this;
  }

  public debug(key: string, value: string): UserInterface {
    this.ui.setDebugText(key, value);

    return this;
  }
}
