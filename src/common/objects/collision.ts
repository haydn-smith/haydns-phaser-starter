import { vec2 } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { DEPTH, TypeOfCollisionTag } from 'constants';

export type OnCollideFnProps = {
  collision: Collision;
  other: Collision;
  delta: number;
  remaining: Phaser.Math.Vector2;
};

export type OnCollideFn = ({ collision, other, delta, remaining }: OnCollideFnProps) => void;

export class Collision extends Phaser.GameObjects.Zone {
  private graphics: Phaser.GameObjects.Graphics;
  private xRemainder: number = 0;
  private yRemainder: number = 0;
  private tags: Partial<Record<string, boolean>> = {};
  private isSolid: boolean = true;
  private collisionMask: number = 0x1111;

  constructor(
    public scene: Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);

    this.setName('Collision');

    this.graphics = new Phaser.GameObjects.Graphics(this.scene);
  }

  static fromArea(scene: Scene, area: Phaser.Geom.Rectangle) {
    return new Collision(scene, area.x, area.y, area.width, area.height);
  }

  preUpdate() {
    if (this.scene.app().isDebug()) {
      this.scene.add.existing(this.graphics);

      const d = this.getWorldTransformMatrix().decomposeMatrix();

      this.graphics
        .setScrollFactor(this.scrollFactorX, this.scrollFactorY)
        .setDepth(DEPTH.Debug)
        .clear()
        .lineStyle(1, 0xff0000, 1)
        .strokeRect(d.translateX, d.translateY, this.width * d.scaleX, this.height * d.scaleY);
    }
  }

  destroy() {
    this.graphics.destroy();
    super.destroy();
  }

  setSolid(solid: boolean = true) {
    this.isSolid = solid;

    return this;
  }

  moveX(amount: number, onCollide?: OnCollideFn) {
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
        onCollide?.({
          collision: this,
          other: intersects,
          delta: this.scene.app().loop.delta,
          remaining: vec2(move, 0),
        });
        this.xRemainder = 0;
        break;
      }
    }

    return moveX;
  }

  moveY(amount: number, onCollide?: OnCollideFn) {
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
        onCollide?.({
          collision: this,
          other: intersects,
          delta: this.scene.app().loop.delta,
          remaining: vec2(0, move),
        });
        this.yRemainder = 0;
        break;
      }
    }

    return moveY;
  }

  intersects(collision: Collision) {
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

  intersectsAny() {
    const d = this.getWorldTransformMatrix().decomposeMatrix();

    return this.scene.allChildren().reduce<Collision | undefined>((acc, o) => {
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

  intersectsWith() {
    const d = this.getWorldTransformMatrix().decomposeMatrix();

    return this.scene.allChildren().reduce<Collision[]>((acc, o) => {
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

  intersectsWithTag(tag: TypeOfCollisionTag) {
    return this.intersectsWith().filter((c) => c.hasTag(tag));
  }

  isBlockedAt(rectange: Phaser.Geom.Rectangle) {
    if (!this.isSolid) {
      return undefined;
    }

    let isColliding: Collision | undefined = undefined;

    this.scene.allChildren().forEach((o) => {
      if (o instanceof Collision && o !== this && o.isSolid && (o.collisionMask & this.collisionMask) > 0) {
        const d = o.getWorldTransformMatrix().decomposeMatrix();

        if (
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

  getActor(): Phaser.GameObjects.Container | this {
    return this.parentContainer ?? this;
  }

  setMask(mask: number) {
    this.collisionMask = mask;

    return this;
  }

  setTag(tag: TypeOfCollisionTag) {
    this.tags[tag] = true;

    return this;
  }

  hasTag(tag: TypeOfCollisionTag) {
    return this.tags[tag] ?? false;
  }
}
