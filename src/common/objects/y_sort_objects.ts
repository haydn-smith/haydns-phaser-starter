import { Scene } from 'common/scene';

export class YSortObjects extends Phaser.GameObjects.Container {
  constructor(public scene: Scene) {
    super(scene);

    this.addToUpdateList();
  }

  public preUpdate() {
    this.sort('y');
  }
}
