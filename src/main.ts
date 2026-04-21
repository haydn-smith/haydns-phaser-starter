import * as Sentry from '@sentry/browser';
import { Game } from 'common/game';
import 'phaser';

import { Boot } from 'scenes/boot';
import { Debug } from 'scenes/debug';
import { MainMenu } from 'scenes/main_menu';
import { Preloader } from 'scenes/preloader';

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
  // @ts-expect-error Injected environment variable.
  debug: process.env.PHASER_DEBUG === 'true',
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
  scene: [Boot, Preloader, MainMenu, Debug],
};

export default new Game(config);
