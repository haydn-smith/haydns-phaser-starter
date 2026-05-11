import { vec2 } from 'common/factories/phaser';
import { Scene } from 'common/scene';
import { MoveToTarget } from 'common/sequences/move_to_target';
import { aperture } from 'ramda';
import { Movement } from './movement';
import { Sequence } from './sequence';

export type Edge = {
  from: Phaser.Math.Vector2;
  to: Phaser.Math.Vector2;
};

const vec2str = (vec2: Phaser.Math.Vector2) => `${vec2.x}-${vec2.y}`;

export class Pathfinder extends Phaser.GameObjects.GameObject {
  private edges: Edge[] = [];
  private graphics: Phaser.GameObjects.Graphics;
  private lastPath: Edge[] = [];

  constructor(public scene: Scene) {
    super(scene, 'Pathfinder');

    this.graphics = this.scene.make.graphics();
  }

  preUpdate() {
    this.scene.add.existing(this.graphics);

    this.graphics.clear();

    this.edges.forEach((edge) => {
      this.graphics
        .lineStyle(1, 0x0000ff, 1)
        .lineBetween(edge.from.x, edge.from.y, edge.to.x, edge.to.y)
        .fillStyle(0x0000ff, 1)
        .fillCircle(edge.to.x, edge.to.y, 4)
        .fillCircle(edge.from.x, edge.from.y, 4);
    });

    this.lastPath.forEach((edge) => {
      this.graphics
        .lineStyle(3, 0x00ff00, 1)
        .lineBetween(edge.from.x, edge.from.y, edge.to.x, edge.to.y)
        .fillStyle(0x00ff00, 1)
        .fillCircle(edge.to.x, edge.to.y, 8)
        .fillCircle(edge.from.x, edge.from.y, 8);
    });
  }

  destroy() {
    this.graphics.destroy();
    super.destroy();
  }

  addPath(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2) {
    this.edges.push({ from, to });

    return this;
  }

  addGrid(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2, step: number) {
    const nodes: Phaser.Math.Vector2[][] = [];

    for (let i = 0; i <= (to.x - from.x) / step; i++) {
      for (let j = 0; j <= (to.y - from.y) / step; j++) {
        nodes[i] = nodes[i] ?? [];
        nodes[i][j] = vec2(from.x + i * step, from.y + j * step);
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        const current = nodes[i][j];

        const up = nodes[i][j - 1];
        if (up) {
          this.addPath(current, up);
        }

        const left = nodes[i - 1]?.[j];
        if (left) {
          this.addPath(current, left);
        }

        const upLeft = nodes[i - 1]?.[j - 1];
        if (upLeft) {
          this.addPath(current, upLeft);
        }

        const upRight = nodes[i + 1]?.[j - 1];
        if (upRight) {
          this.addPath(current, upRight);
        }
      }
    }

    return this;
  }

  findPath(from: Phaser.Math.Vector2, to: Phaser.Math.Vector2) {
    // Get starting point.
    const start = [
      ...this.edges.sort((a, b) =>
        Math.min(a.from.distance(from), a.to.distance(from)) > Math.min(b.from.distance(from), b.to.distance(from))
          ? 1
          : -1
      ),
    ];
    const startPoint = start[0].from.distance(from) > start[0].to.distance(from) ? start[0].to : start[0].from;

    // Get ending point.
    const end = [
      ...this.edges.sort((a, b) =>
        Math.min(a.from.distance(to), a.to.distance(to)) > Math.min(b.from.distance(to), b.to.distance(to)) ? 1 : -1
      ),
    ];
    const endPoint = end[0].from.distance(to) > end[0].to.distance(to) ? end[0].to : end[0].from;

    const nodes = this.aStar(this.edges, startPoint, endPoint, (node, to) => Math.abs(node.distance(to)));

    this.lastPath = [...aperture(2, nodes).map((o) => ({ from: o[0], to: o[1] }))];
    return [...this.lastPath];
  }

  moveAlongPath(movement: Movement, target: Phaser.Math.Vector2) {
    const paths = this.findPath(vec2(movement.getActor().x, movement.getActor().y), target);

    this.scene.add.existing(
      new Sequence(this.scene, [...paths.map((p) => new MoveToTarget(movement, p.to))]).destroyWhenComplete().start()
    );

    return this;
  }

  // https://en.wikipedia.org/wiki/A*_search_algorithm
  private aStar(
    edges: Edge[],
    from: Phaser.Math.Vector2,
    to: Phaser.Math.Vector2,
    h: (node: Phaser.Math.Vector2, to: Phaser.Math.Vector2) => number
  ): Phaser.Math.Vector2[] {
    const open = { [vec2str(from)]: from };

    const gValues = { [vec2str(from)]: 0 };
    const fValues = { [vec2str(from)]: h(from, to) };

    const traversed: Record<string, Phaser.Math.Vector2> = {};

    while (Object.values(open).length) {
      let current = Object.values(open).sort((a, b) =>
        (fValues[vec2str(a)] ?? Infinity) > (fValues[vec2str(b)] ?? Infinity) ? 1 : -1
      )[0];

      if (current.equals(to)) {
        const path = [current];
        while (traversed[vec2str(current)]) {
          current = traversed[vec2str(current)];
          path.unshift(current);
        }
        return path;
      }

      delete open[vec2str(current)];

      const neighbours: Phaser.Math.Vector2[] = edges
        .filter((e) => e.from.equals(current) || e.to.equals(current))
        .map((e) => (e.from.equals(current) ? e.to : e.from));

      for (const neighbour of neighbours) {
        const gValue = (gValues[vec2str(current)] ?? Infinity) + h(current, neighbour);

        if (gValue < (gValues[vec2str(neighbour)] ?? Infinity)) {
          traversed[vec2str(neighbour)] = current;
          gValues[vec2str(neighbour)] = gValue;
          fValues[vec2str(neighbour)] = gValue + h(neighbour, to);
          open[vec2str(neighbour)] = neighbour;
        }
      }
    }

    return [];
  }
}
