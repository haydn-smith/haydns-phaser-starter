import { directionalInputs } from 'common/factories/input';
import { Input } from 'common/objects/input/input';
import { Scene } from 'common/scene';
import { ACTION } from 'constants';

export class InputExample extends Scene {
  private inputs: Input | null;

  private dot: Phaser.GameObjects.Container;

  constructor() {
    super('Input Example');
  }

  create() {
    // A moving dot.
    this.dot = this.add.container(this.width() / 2, this.height() / 2);
    const graphics2 = this.add.graphics();
    this.dot.add(graphics2);
    graphics2.fillStyle(0xff0000, 1).fillRect(0, 0, 20, 20);

    // Input controller.
    this.inputs = this.add.existing(directionalInputs(this));

    // Press K to destroy and recreate the inputs.
    this.input.keyboard?.on('keydown-K', () => {
      if (!this.inputs) {
        this.inputs = this.add.existing(directionalInputs(this));
      } else {
        this.inputs?.destroy();
        this.inputs = null;
      }
    });
  }

  update(_: number, delta: number) {
    // Move the dot.
    if (this.inputs) {
      const x = this.inputs.isPressed(ACTION.Right) - this.inputs.isPressed(ACTION.Left);
      const y = this.inputs.isPressed(ACTION.Down) - this.inputs.isPressed(ACTION.Up);
      this.dot.setPosition((this.dot.x += x * delta * 0.001 * 100), (this.dot.y += y * delta * 0.001 * 100));
    }

    // Allows us to see the objects in the scene as the inputs are created
    // and destroyed.
    console.log(this.allChildren().map((o) => o.type));
  }
}
