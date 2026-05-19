import { Sequence } from 'common/objects/sequence';
import { Scene } from 'common/scene';
import { RunCallback } from 'common/sequences/run_callback';
import { RunTween } from 'common/sequences/run_tween';
import { Wait } from 'common/sequences/wait';
import { logEvent } from 'common/utils/log';
import { SCENE, SPRITE } from 'constants';

export class StudioLogo extends Scene {
  constructor() {
    super(SCENE.StudioLogo);
  }

  create() {
    logEvent('Displaying studio logo.');

    const logo = this.add.sprite(this.halfWidth(), this.halfHeight(), SPRITE.StudioLogo).setScale(4).setAlpha(0);
    logo.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    this.add.existing(
      new Sequence(this, [
        new Wait(500),
        new RunTween(this, {
          targets: logo,
          duration: 500,
          alpha: 1,
        }),
        new Wait(1000),
        new RunTween(this, {
          targets: logo,
          duration: 500,
          alpha: 0,
        }),
        new RunCallback(() => this.transition().runScene(this, SCENE.WebglCheck)),
      ])
        .destroyWhenComplete()
        .start()
    );
  }
}
