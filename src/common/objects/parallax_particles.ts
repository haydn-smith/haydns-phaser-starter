import { vec2 } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { TypeOfSprite } from 'constants';

export class ParallaxParticles extends Phaser.GameObjects.Container {
  private particles: Record<
    string,
    {
      particles: Phaser.GameObjects.Particles.ParticleEmitter;
      scrollFactor: Phaser.Math.Vector2;
    }
  > = {};

  private lastCameraPosition: Phaser.Math.Vector2;

  constructor(public scene: Scene) {
    super(scene, 0, 0, []);

    this.setName('Parallax Particles');

    this.lastCameraPosition = vec2(this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY);
  }

  preUpdate() {
    const camera = this.scene.cameras.main;
    const position = vec2(camera.scrollX, camera.scrollY);
    const moved = this.lastCameraPosition.clone().subtract(position);

    Object.values(this.particles).forEach((particle) => {
      particle.particles.forEachAlive((p) => {
        p.setPosition(p.x + moved.x * particle.scrollFactor.x, p.y + moved.y * particle.scrollFactor.y);
      }, {});
    });

    this.lastCameraPosition = position;
  }

  destroy() {
    Object.values(this.particles).forEach((p) => p.particles.destroy());
    super.destroy();
  }

  addParticleEmitter(
    key: string,
    texture: TypeOfSprite,
    config: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig,
    scrollFactor: Phaser.Math.Vector2
  ) {
    const existing = this.particles[key];

    if (existing) {
      existing.scrollFactor = scrollFactor;
      existing.particles.updateConfig(config).setTexture(texture);
    } else {
      const particles = this.scene.add
        .particles(0, 0, texture, config)
        .setScrollFactor(this.scrollFactorX, this.scrollFactorY);
      this.add(particles);
      this.particles[key] = {
        particles,
        scrollFactor,
      };
    }

    return this;
  }

  removeParticleEmitter(key: string) {
    this.particles[key].particles.destroy();

    delete this.particles[key];

    return this;
  }
}
