import { Collision as CollisionObject } from 'systems/collision/objects/collision';

export class Collision {
  constructor(private collision: CollisionObject) {}

  public solid(): Collision {
    this.collision.setSolid(true);

    return this;
  }

  public notSolid(): Collision {
    this.collision.setSolid(false);

    return this;
  }

  public mask(mask: number): Collision {
    this.collision.setMask(mask);

    return this;
  }

  public tag(tag: string): Collision {
    this.collision.setTag(tag);

    return this;
  }

  public hasTag(tag: string): boolean {
    return this.collision.hasTag(tag);
  }

  public isSolid(): boolean {
    return this.collision.isSolid;
  }

  public moveX(amount: number, onCollide?: (other: Collision) => void): number {
    return this.collision.moveX(amount, (c) => onCollide?.(new Collision(c)));
  }

  public moveY(amount: number, onCollide?: (other: Collision) => void): number {
    return this.collision.moveY(amount, (c) => onCollide?.(new Collision(c)));
  }

  public intersects(other: Collision): boolean {
    return this.collision.intersects(other.toGameObject());
  }

  public intersections(): Collision[] {
    return this.collision.intersectsWith().map((c) => new Collision(c));
  }

  public toGameObject(): CollisionObject {
    return this.collision;
  }

  public destroy(): void {
    this.collision.destroy();
  }
}
