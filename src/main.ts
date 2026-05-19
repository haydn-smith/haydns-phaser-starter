import * as Sentry from '@sentry/browser';
import { CheckerFilter } from 'common/filters/checker';
import { WipeFilter } from 'common/filters/wipe';
import { Game } from 'common/game';
import 'phaser';

import { Boot } from 'scenes/boot';
import { CameraExample } from 'scenes/examples/camera_example';
import { CollisionExample } from 'scenes/examples/collision_example';
import { InputExample } from 'scenes/examples/input_example';
import { MovementExample } from 'scenes/examples/movement_example';
import { ParallaxParticlesExample } from 'scenes/examples/parallax_particles_example';
import { PathfinderExample } from 'scenes/examples/pathfinder_example';
import { PathfinderTilemapExample } from 'scenes/examples/pathfinder_tilemap_example';
import { SaveExample } from 'scenes/examples/save_example';
import { SoundExample } from 'scenes/examples/sound_example';
import { TilemapExample } from 'scenes/examples/tilemap_example';
import { TransitionExample } from 'scenes/examples/transition_example';
import { TypewriterExample } from 'scenes/examples/typewriter_example';
import { Preloader } from 'scenes/preloader';
import { SoundManager } from 'scenes/sound_manager';
import { StudioLogo } from 'scenes/studio_logo';
import { TransitionManager } from 'scenes/transition_manager';
import { WebglCheck } from 'scenes/webgl_check';

// @ts-expect-error Injected environment variable.
if (process.env.PHASER_SENTRY_DSN) {
  Sentry.init({
    // @ts-expect-error Injected environment variable.
    dsn: process.env.PHASER_SENTRY_DSN,
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.consoleLoggingIntegration({ levels: ['info', 'warn', 'error'] }),
      Sentry.replayIntegration(),
      Sentry.replayCanvasIntegration(),
    ],
    // @ts-expect-error Injected environment variable.
    release: process.env.GIT_SHA,
    // @ts-expect-error Injected environment variable.
    environment: process.env.PHASER_ENVIRONMENT,
    tracesSampleRate: 1.0,
    enableLogs: true,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#000000',
  antialias: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    gamepad: true,
  },
  renderNodes: {
    Wipe: WipeFilter,
    Checker: CheckerFilter,
  },
  scene: [
    // All scenes that can be started in the game.
    Boot,
    Preloader,
    StudioLogo,
    WebglCheck,
    SoundManager,
    TransitionManager,
    // Example scenes.
    TypewriterExample,
    CameraExample,
    InputExample,
    CollisionExample,
    MovementExample,
    SoundExample,
    TilemapExample,
    ParallaxParticlesExample,
    PathfinderExample,
    PathfinderTilemapExample,
    SaveExample,
    TransitionExample,
  ],
};

export default new Game({
  // @ts-expect-error Injected environment variable.
  debug: process.env.PHASER_DEBUG === 'true',
  ...config,
});
