export const getAllChildren = (scene: Phaser.Scene): Phaser.GameObjects.GameObject[] => {
  return traverse(scene.children.getAll());
};

const traverse = (list: Phaser.GameObjects.GameObject[]): Phaser.GameObjects.GameObject[] => {
  return list.flatMap((o) => (o instanceof Phaser.GameObjects.Container ? [o, ...traverse(o.getAll())] : [o]));
};
