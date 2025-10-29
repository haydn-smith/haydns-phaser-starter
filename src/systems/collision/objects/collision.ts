import { getAllChildren } from 'systems/collision/utils/get_all_children';
import { debugDepth, isDebug } from 'systems/flags';

export class Collision extends Phaser.GameObjects.Zone {
  private graphics: Phaser.GameObjects.Graphics;

  private xRemainder: number = 0;

  private yRemainder: number = 0;

  private tags: Partial<Record<string, boolean>> = {};

  public isSolid: boolean = true;

  public collisionMask: number = 0x1111;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);

    this.setName('Collision');

    this.graphics = this.scene.add.graphics();
  }

  public static fromArea(scene: Phaser.Scene, area: Phaser.Geom.Rectangle) {
    return new Collision(scene, area.x, area.y, area.width, area.height);
  }

  public preUpdate() {
    if (isDebug()) {
      const d = this.getWorldTransformMatrix().decomposeMatrix();

      this.graphics
        .setDepth(debugDepth())
        .clear()
        .lineStyle(1, 0xff0000, 1)
        .strokeRect(d.translateX, d.translateY, this.width * d.scaleX, this.height * d.scaleY);
    }
  }

  public destroy() {
    super.destroy();

    this.graphics.destroy();
  }

  public setSolid(solid: boolean): Collision {
    this.isSolid = solid;

    return this;
  }

  public moveX(amount: number, onCollide?: (collidesWith: Collision) => void): number {
    let moveX = 0;

    this.xRemainder += amount;

    if (Math.abs(this.xRemainder) < 1) {
      return 0;
    }

    let move = Math.floor(this.xRemainder);

    this.xRemainder -= move;

    const sign = move > 0 ? 1 : -1;

    const d = this.getWorldTransformMatrix().decomposeMatrix();
    while (move != 0) {
      const intersects = this.isBlockedAt(
        new Phaser.Geom.Rectangle(
          d.translateX + moveX + sign,
          d.translateY,
          this.width * d.scaleX,
          this.height * d.scaleY
        )
      );

      if (!intersects) {
        moveX += sign;
        move -= sign;
      } else {
        onCollide?.(intersects);
        this.xRemainder = 0;
        break;
      }
    }

    return moveX;
  }

  public moveY(amount: number, onCollide?: (collidesWith: Collision) => void): number {
    let moveY = 0;

    this.yRemainder += amount;

    if (Math.abs(this.yRemainder) < 1) {
      return 0;
    }

    let move = Math.floor(this.yRemainder);

    this.yRemainder -= move;

    const sign = move > 0 ? 1 : -1;

    const d = this.getWorldTransformMatrix().decomposeMatrix();
    while (move != 0) {
      const intersects = this.isBlockedAt(
        new Phaser.Geom.Rectangle(
          d.translateX,
          d.translateY + moveY + sign,
          this.width * d.scaleX,
          this.height * d.scaleY
        )
      );

      if (!intersects) {
        moveY += sign;
        move -= sign;
      } else {
        onCollide?.(intersects);
        this.yRemainder = 0;
        break;
      }
    }

    return moveY;
  }

  public intersects(collision: Collision): boolean {
    const d = this.getWorldTransformMatrix().decomposeMatrix();
    const dOther = collision.getWorldTransformMatrix().decomposeMatrix();

    return Phaser.Geom.Intersects.RectangleToRectangle(
      new Phaser.Geom.Rectangle(d.translateX, d.translateY, this.width * d.scaleX, this.height * d.scaleY),
      new Phaser.Geom.Rectangle(
        dOther.translateX,
        dOther.translateY,
        collision.width * dOther.scaleX,
        collision.height * dOther.scaleY
      )
    );
  }

  public intersectsAny(): Collision | undefined {
    const d = this.getWorldTransformMatrix().decomposeMatrix();

    return getAllChildren(this.scene).reduce<Collision | undefined>((acc, o) => {
      if (!(o instanceof Collision && o !== this && (o.collisionMask & this.collisionMask) > 0)) {
        return acc;
      }

      const dOther = o.getWorldTransformMatrix().decomposeMatrix();

      return acc ||
        Phaser.Geom.Intersects.RectangleToRectangle(
          new Phaser.Geom.Rectangle(d.translateX, d.translateY, this.width * d.scaleX, this.height * d.scaleY),
          new Phaser.Geom.Rectangle(
            dOther.translateX,
            dOther.translateY,
            o.width * dOther.scaleX,
            o.height * dOther.scaleY
          )
        )
        ? o
        : undefined;
    }, undefined);
  }

  public intersectsWith(): Collision[] {
    const d = this.getWorldTransformMatrix().decomposeMatrix();

    return getAllChildren(this.scene).reduce<Collision[]>((acc, o) => {
      if (!(o instanceof Collision && o !== this && (o.collisionMask & this.collisionMask) > 0)) {
        return acc;
      }

      const dOther = o.getWorldTransformMatrix().decomposeMatrix();

      const collides = Phaser.Geom.Intersects.RectangleToRectangle(
        new Phaser.Geom.Rectangle(d.translateX, d.translateY, this.width * d.scaleX, this.height * d.scaleY),
        new Phaser.Geom.Rectangle(
          dOther.translateX,
          dOther.translateY,
          o.width * dOther.scaleX,
          o.height * dOther.scaleY
        )
      );

      return collides ? [...acc, o] : acc;
    }, []);
  }

  private isBlockedAt(rectange: Phaser.Geom.Rectangle): Collision | undefined {
    if (!this.isSolid) {
      return undefined;
    }

    let isColliding: Collision | undefined = undefined;

    getAllChildren(this.scene).forEach((o) => {
      if (o instanceof Collision && o.isSolid && (o.collisionMask & this.collisionMask) > 0) {
        const d = o.getWorldTransformMatrix().decomposeMatrix();

        if (
          o !== this &&
          Phaser.Geom.Intersects.RectangleToRectangle(
            new Phaser.Geom.Rectangle(d.translateX, d.translateY, o.width * d.scaleX, o.height * d.scaleY),
            rectange
          )
        ) {
          isColliding = o;
        }
      }
    });

    return isColliding;
  }

  public getActor(): Phaser.Types.Math.Vector2Like {
    return this.parentContainer ?? this;
  }

  public setMask(mask: number): Collision {
    this.collisionMask = mask;

    return this;
  }

  public setTag(tag: string): Collision {
    this.tags[tag] = true;

    return this;
  }

  public hasTag(tag: string): boolean {
    return this.tags[tag] ?? false;
  }
}
