export class YSortObjects extends Phaser.GameObjects.Container {
  preUpdate() {
    this.sort('y');
  }
}
