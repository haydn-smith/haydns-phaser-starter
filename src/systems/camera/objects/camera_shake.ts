import { states, States } from 'systems/states';

type ShakeStates = 'tweening' | 'create tween' | 'tween finished' | 'idle';

export class CameraShake extends Phaser.GameObjects.GameObject {
  private states: States<ShakeStates, 'idle'>;

  private amount = 0;

  private speed = 0;

  private falloff = 0;

  private duration = 0;

  private time = 0;

  private offset: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene) {
    super(scene, 'Camera Shake');

    this.states = states<ShakeStates, 'idle'>(scene, 'idle')
      .add('create tween', ({ change, delta }) => {
        this.time += delta;

        change('tweening');

        this.scene.tweens.add({
          targets: this.offset,
          ease: Phaser.Math.Easing.Quadratic.InOut,
          duration: this.speed,
          props: {
            x: { to: Math.random() * this.amount - this.amount / 2, from: this.offset.x },
            y: { to: Math.random() * this.amount - this.amount / 2, from: this.offset.y },
          },
          onComplete: () => change('tween finished'),
        });
      })
      .add('tweening', ({ delta }) => {
        this.time += delta;
      })
      .add('tween finished', ({ change, delta }) => {
        this.time += delta;

        this.amount = Math.max(0, this.amount - this.falloff * this.time * 0.001);

        change(this.time > this.duration && this.duration !== -1 ? 'idle' : 'create tween');
      });
  }

  public shake(amount = 16, falloff = 16, duration = 1000, speed = 10) {
    this.amount = amount;
    this.falloff = falloff;
    this.duration = duration;
    this.speed = speed;
    this.time = 0;

    this.states.change('create tween');
  }

  public shakeOffset(): Phaser.Math.Vector2 {
    return this.offset;
  }
}
