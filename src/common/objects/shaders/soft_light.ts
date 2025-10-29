import { Shader } from 'constants';

const fragShader = `
#define SHADER_NAME SOFTLIGHT_FS
precision mediump float;
uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;
vec3 SoftLight(vec3 a, vec3 b)
{
    vec3 r = (1.0 - a) * a * b + a * (1.0 - (1.0 - a) * (1.0 - b));
    return r;
}

void main( void )
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec4 color = texture2D(uMainSampler, outTexCoord);
    // vec3 light = vec3(51 / 256, 91 / 256, 152 / 256);
    vec3 light = vec3(256 / 256, 0 / 256, 0 / 256);
    vec3 mixColor = SoftLight(color.rgb, light);

    gl_FragColor = mix(color, vec4(mixColor, color.a), 0.9);
}
`;

export class SoftLight extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      name: Shader.SoftLight,
      game,
      renderTarget: true,
      fragShader,
    });
  }

  onPreRender(): void {
    this.set1f('uResolution', this.renderer.width);
  }
}
