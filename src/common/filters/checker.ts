const filterName = 'Checker';

const fragShader = `
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D uMainSampler;

uniform vec2 uResolution;
uniform float uTime;
uniform float uProgress;

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

  // Set this value to change the color and alpha of the current pixel.
  if (
    pos.x > floor(pos.x / 100.0) * 100.0 && pos.x < floor(pos.x / 100.0) * 100.0 + bar
    && pos.y > floor(pos.y / 100.0) * 100.0 && pos.y < floor(pos.y / 100.0) * 100.0 + bar
  ) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = vec4(pixel);
  }
}
`;

export class CheckerController extends Phaser.Filters.Controller {
  progress = 0;

  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    super(camera, filterName);
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
  }
}
