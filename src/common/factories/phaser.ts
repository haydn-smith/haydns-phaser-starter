export function vec2(x: number, y: number): Phaser.Math.Vector2 {
  return new Phaser.Math.Vector2(x, y);
}

export function rect(x: number, y: number, w: number, h: number): Phaser.Geom.Rectangle {
  return new Phaser.Geom.Rectangle(x, y, w, h);
}
