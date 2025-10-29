import { Shader } from 'constants';

// https://www.shadertoy.com/view/Ns3yzs
const fragShader = `
#define SHADER_NAME ANTIALIAS_FS

precision mediump float;

// Scene buffer
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

// Effect parameters
uniform vec2 uTextureSize;

float num_samples = 0.0;

vec4 GetFragValAt( vec2 uv )
{
    num_samples += 1.0;

    return texture2D(uMainSampler, outTexCoord + (uv / uTextureSize));
}

void main()
{
    // Normalized pixel coordinates (from -1 to 1)
    vec2 uv = outTexCoord;

    // Change offset to adjust sampling distance
    float offset = 1.0;

    vec4 fragColor = GetFragValAt( uv );

    // samples in +/- x direction
    fragColor += GetFragValAt(uv + vec2( offset, 0.0));
    fragColor += GetFragValAt(uv + vec2( -offset, 0.0));
    fragColor += GetFragValAt(uv + vec2( offset / 2.0, 0.0));
    fragColor += GetFragValAt(uv + vec2( -offset / 2.0, 0.0));

    // samples in +/- y direction
    fragColor += GetFragValAt(uv + vec2( 0.0, offset ));
    fragColor += GetFragValAt(uv + vec2( 0.0, -offset));
    fragColor += GetFragValAt(uv + vec2( 0.0, offset / 2.0 ));
    fragColor += GetFragValAt(uv + vec2( 0.0, -offset / 2.0));

    // samples at diagonals
    fragColor += GetFragValAt(uv + vec2(offset, offset));
    fragColor += GetFragValAt(uv + vec2(-offset, offset));
    fragColor += GetFragValAt(uv + vec2(offset, -offset));
    fragColor += GetFragValAt(uv + vec2(-offset, -offset));
    fragColor += GetFragValAt(uv + vec2(offset / 2.0, offset / 2.0));
    fragColor += GetFragValAt(uv + vec2(-offset / 2.0, offset / 2.0));
    fragColor += GetFragValAt(uv + vec2(offset / 2.0, -offset / 2.0));
    fragColor += GetFragValAt(uv + vec2(-offset / 2.0, -offset / 2.0));

    fragColor /= num_samples;

    gl_FragColor = fragColor;
}
`;

export class Antialias extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  public alpha: number = 0;

  constructor(game: Phaser.Game) {
    super({
      name: Shader.AntiAlias,
      game,
      fragShader,
    });
  }

  onPreRender() {
    this.set2f('uTextureSize', this.renderer.width, this.renderer.height);
  }
}
