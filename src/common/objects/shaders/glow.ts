import { Shader } from 'constants';

const fragShader = `
#define SHADER_NAME GLOW_FS

precision mediump float;

// Scene buffer
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

// Effect parameters
uniform vec2 uTextureSize;
uniform float uTime;
uniform float uSpeed;
uniform float uIntensity;
uniform float uAlpha;
uniform bool uShouldProcess;

void main()
{
  vec4 pixel = texture2D(uMainSampler, outTexCoord);

  vec4 sum = vec4(0,0,0,0);
  float count = 0.0;
  for(int xx = -32; xx <= 32; xx += 8) {
    for(int yy = -32; yy <= 32; yy += 8) {
      sum += texture2D(uMainSampler, outTexCoord + (vec2(xx, yy) / uTextureSize));
      count++;
    }
  }
  sum *= 2.0 / count;

  gl_FragColor = pixel;
  if (pixel.a < 0.1)
  {
    vec4 glowColor = vec4(1,1,1,1) * sum.a * uAlpha;
    gl_FragColor = pixel + (glowColor * (sin(uTime * 0.001 * uSpeed) * 0.2 + 0.8));
  }
}
`;

export class Glow extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  public alpha: number = 0;

  constructor(game: Phaser.Game) {
    super({
      name: Shader.Glow,
      game,
      fragShader,
    });
  }

  onPreRender() {
    this.set2f('uTextureSize', this.renderer.width, this.renderer.height);
    this.set1f('uTime', this.game.loop.time);
    this.set1f('uSpeed', 4.0);
    this.set1f('uIntensity', 2.0);
    this.set1f('uAlpha', this.alpha);
  }
}
