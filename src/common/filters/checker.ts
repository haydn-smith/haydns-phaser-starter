import { randomInt } from 'common/utils/math';

const filterName = 'Checker';

const fragShader = `
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;
uniform float uDirection;

varying vec2 outTexCoord;

// Generate a psuedorandom number.
float random(vec2 uv)
{
  return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
  // Screen dimensions.
  vec2 screen = uResolution.xy;

  // Pixel coordinates.
  vec2 pos = gl_FragCoord.xy;

  // Normalized pixel coordinates (from -1 to 1)
  vec2 uv = outTexCoord;

  // The color and alpha of the pixel.
  vec4 pixel = texture2D(uMainSampler, uv);

  float bar = 100.0 * uProgress;

  // From bottom-left.
  if (uDirection == 0.0) {
    if (
      pos.x > floor(pos.x / 100.0) * 100.0 && pos.x < floor(pos.x / 100.0) * 100.0 + bar
      && pos.y > floor(pos.y / 100.0) * 100.0 && pos.y < floor(pos.y / 100.0) * 100.0 + bar
    ) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = vec4(pixel);
    }
  }
  // From bottom-right.
  else if (uDirection == 1.0) {
    if (
      pos.x > floor(pos.x / 100.0) * 100.0 + 100.0 - bar && pos.x < floor(pos.x / 100.0) * 100.0 + 100.0
      && pos.y > floor(pos.y / 100.0) * 100.0 && pos.y < floor(pos.y / 100.0) * 100.0 + bar
    ) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = vec4(pixel);
    }
  }
  // From top-left.
  else if (uDirection == 2.0) {
    if (
      pos.x > floor(pos.x / 100.0) * 100.0 && pos.x < floor(pos.x / 100.0) * 100.0 + bar
      && pos.y > floor(pos.y / 100.0) * 100.0 + 100.0 - bar && pos.y < floor(pos.y / 100.0) * 100.0 + 100.0
    ) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = vec4(pixel);
    }
  }
  // From top-right.
  else if (uDirection == 3.0) {
    if (
      pos.x > floor(pos.x / 100.0) * 100.0 + 100.0 - bar && pos.x < floor(pos.x / 100.0) * 100.0 + 100.0
      && pos.y > floor(pos.y / 100.0) * 100.0 + 100.0 - bar && pos.y < floor(pos.y / 100.0) * 100.0 + 100.0
    ) {
      gl_FragColor = vec4(0, 0, 0, 1);
    } else {
      gl_FragColor = vec4(pixel);
    }
  }
}
`;

export class CheckerController extends Phaser.Filters.Controller {
  progress = 0;

  direction = 1.0;

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    super(camera, filterName);
  }

  randomise() {
    this.direction = randomInt(0, 3);
  }
}

export class CheckerFilter extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {
  constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
    super(filterName, manager, undefined, fragShader);
  }

  setupUniforms(controller: CheckerController, drawingContext: Phaser.Renderer.WebGL.DrawingContext) {
    const programManager = this.programManager;

    programManager.setUniform('uResolution', [drawingContext.width, drawingContext.height]);
    programManager.setUniform('uTime', drawingContext.renderer.game.loop.time / 1000);
    programManager.setUniform('uProgress', controller.progress);
    programManager.setUniform('uDirection', controller.direction);
  }
}
