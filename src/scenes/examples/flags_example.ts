import { Scene } from 'common/scene';
import { FLAG } from 'constants';

export class FlagsExample extends Scene {
  constructor() {
    super('Flags Example');
  }

  create() {
    // Set a flag.
    this.input.keyboard?.on('keydown-A', () => {
      this.app().setFlag(FLAG.Debug);
    });

    // Unset a flag.
    this.input.keyboard?.on('keydown-S', () => {
      this.app().unsetFlag(FLAG.Debug);
    });

    // Check the flag.
    this.input.keyboard?.on('keydown-D', () => {
      console.log(this.app().checkFlag(FLAG.Debug));
    });
  }
}
