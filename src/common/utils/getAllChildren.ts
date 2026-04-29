import { Scene } from 'common/scene';

const traverse = (list: Phaser.GameObjects.GameObject[]): Phaser.GameObjects.GameObject[] => {
  return list.flatMap((o) => (o instanceof Phaser.GameObjects.Container ? [o, ...traverse(o.getAll())] : [o]));
};

export const getAllChildren = (scene: Scene): Phaser.GameObjects.GameObject[] => {
  return traverse([...scene.children.getAll(), ...scene.sys.updateList.getActive()]);
};
