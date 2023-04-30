import { cnoise3 } from "../../Noise/ClassicPerlinNoise/cnoise3";

export const vertexShader = `

uniform float u_time;
uniform float u_intensity;
uniform float u_musicData;

varying vec2 vUv;
varying float vDisplacement;

${cnoise3}


void main(){
  vUv = uv;

  vDisplacement = cnoise(position + vec3(2.0 * u_time));

  vec3 newPosition = position + normal * (u_intensity * vDisplacement) ;

  vec4 modelPosition = modelMatrix * vec4(newPosition,1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}

`;