import { Shader } from 'constants';

const fragShader = `
#define SHADER_NAME SOFTLIGHT_FS

precision mediump float;

uniform vec2      uTextureSize;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;

uniform float uTime;

float random (vec2 uv)
{
    return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
  vec4 color = texture2D(uMainSampler, outTexCoord);

  float noise = random(floor(outTexCoord * (uTextureSize / 1.0)) * floor(uTime * 0.001));

  if (color.a < 0.1) {
    gl_FragColor = color;
  } else {
    gl_FragColor = mix(color, vec4(noise), 0.02);
  }
}
`;

export class Noise extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      name: Shader.Noise,
      game,
      renderTarget: true,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set2f('uTextureSize', this.renderer.width, this.renderer.height);
    this.set1f('uTime', this.game.loop.time);
  }
}
