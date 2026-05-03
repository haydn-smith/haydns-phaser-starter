import { directionalInputs } from 'common/factories/input';
import { vec2 } from 'common/factories/phaser';
import { Input } from 'common/objects/input/input';
import { ParallaxParticles } from 'common/objects/parallax_particles';
import { Scene } from 'common/scene';
import { ACTION, DEPTH, SPRITE } from 'constants';

// TODO: Ensure the parallax object cleans up its children properly.
// TODO: Allow the parallax object to not be locked to the camera position.
export class ParallaxParticlesExample extends Scene {
  private inputs: Input;

  constructor() {
    super('Parallax Particles Example');
  }

  create() {
    this.inputs = this.add.existing(directionalInputs(this));

    const parallaxParticles = this.add.existing(new ParallaxParticles(this));

    // Create a mask.
    const mask = this.make
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(this.width() / 4, this.height() / 4, this.width() / 2, this.height() / 2)
      .setScrollFactor(0);

    // Create a border.
    this.add
      .graphics()
      .lineStyle(8, 0xffffff, 1)
      .strokeRect(this.width() / 4, this.height() / 4, this.width() / 2, this.height() / 2)
      .setScrollFactor(0)
      .setDepth(DEPTH.Foreground);

    parallaxParticles.addParticleEmitter(
      'one',
      SPRITE.White1px,
      {
        lifespan: 3000,
        scale: 8,
        speed: { min: 50, max: 100 },
        angle: { min: 0, max: 360 },
        frequency: 500,
        quantity: 10,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.width() / 4,
            this.height() / 4,
            this.width() / 2,
            this.height() / 2
          ) as unknown as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      },
      vec2(1, 1)
    );

    parallaxParticles.addParticleEmitter(
      'two',
      SPRITE.White1px,
      {
        lifespan: 3000,
        scale: 16,
        speed: { min: 50, max: 100 },
        angle: { min: 0, max: 360 },
        frequency: 500,
        quantity: 5,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.width() / 4,
            this.height() / 4,
            this.width() / 2,
            this.height() / 2
          ) as unknown as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      },
      vec2(1.5, 1.5)
    );

    parallaxParticles.addParticleEmitter(
      'three',
      SPRITE.White1px,
      {
        lifespan: 3000,
        scale: 32,
        speed: { min: 50, max: 100 },
        angle: { min: 0, max: 360 },
        frequency: 500,
        quantity: 2,
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(
            this.width() / 4,
            this.height() / 4,
            this.width() / 2,
            this.height() / 2
          ) as unknown as Phaser.Types.GameObjects.Particles.RandomZoneSource,
        },
      },
      vec2(2, 2)
    );

    // Apply the mask.
    parallaxParticles.enableFilters();
    parallaxParticles.filters?.internal.addMask(mask);
  }

  update(_: number, delta: number) {
    // Allows us to see the objects in the scene.
    console.log(this.allChildren().map((o) => o.type));

    // Move the camera.
    if (this.inputs) {
      const x = this.inputs.isPressed(ACTION.Right) - this.inputs.isPressed(ACTION.Left);
      const y = this.inputs.isPressed(ACTION.Down) - this.inputs.isPressed(ACTION.Up);
      this.cameras.main.setScroll(
        this.cameras.main.scrollX + x * 300 * delta * 0.001,
        this.cameras.main.scrollY + y * 300 * delta * 0.001
      );
    }
  }
}
