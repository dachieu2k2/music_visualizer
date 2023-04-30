import { snoise3 } from "../../Noise/SimplexNoise/snoise3";
import { palette } from "../common/palette";

export const vertexShader = `
    uniform float uTime;
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    uniform vec3 colorD;

    varying float vColorMix;
    varying vec3 vColor;

    ${snoise3}
    ${palette}

    void main() {
        float n = snoise(position*0.2 + uTime*0.1);
        n = n*0.5 + 0.5;

        vec3 pos = position;
        vec3 dir = normalize(pos - vec3(0.0));
        pos -= dir*n*2.0;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        vColorMix = n;
        vColor = palette(pos.x*0.1 + uTime*0.1, colorA, colorB, colorC, colorD);
    }
`