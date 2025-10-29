export class YSortObjects extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);

    this.addToUpdateList();
  }

  public preUpdate() {
    this.sort('y');
  }
}
