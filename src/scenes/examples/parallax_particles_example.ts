import { directionalInputs } from 'common/factories/input';
import { vec2 } from 'common/factories/phaser';
import { Input } from 'common/objects/input/input';
import { ParallaxParticles } from 'common/objects/parallax_particles';
import { Scene } from 'common/scene';
import { ACTION, DEPTH, SPRITE } from 'constants';

export class ParallaxParticlesExample extends Scene {
  private inputs: Input;

  constructor() {
    super('Parallax Particles Example');
  }

  create() {
    this.inputs = this.add.existing(directionalInputs(this));

    let parallaxParticles: ParallaxParticles;

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

    // Create the particles.
    this.input.keyboard?.on('keydown-A', () => {
      parallaxParticles?.destroy();

      parallaxParticles = new ParallaxParticles(this).setScrollFactor(0);

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
    });

    // Add it to the scene.
    this.input.keyboard?.on('keydown-S', () => {
      this.add.existing(parallaxParticles);
    });

    // Destroy it.
    this.input.keyboard?.on('keydown-D', () => {
      parallaxParticles.destroy();
    });

    // Change config.
    this.input.keyboard?.on('keydown-F', () => {
      parallaxParticles.addParticleEmitter(
        'one',
        SPRITE.White1px,

        {
          lifespan: 3000,
          scale: 64,
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
        vec2(5)
      );
    });

    // Remove an emitter.
    this.input.keyboard?.on('keydown-G', () => {
      parallaxParticles.removeParticleEmitter('one');
    });
  }

  update(_: number, delta: number) {
    // Allows us to see the objects in the scene.
    console.log(this.allChildren().map((o) => `${o.type} - ${o.name}`));

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
