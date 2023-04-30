export const vertex = `
   


    uniform float uTime;
    uniform float uRadius;

    uniform mat4 uMusicData;
    varying vec2 vUv;

    void main(){

        vec4 newPosition = vec4(position,1.0) * uMusicData; 

        float x = position.x;
        float y = newPosition.y-5.0;
        float z = 0.0;



        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;


        gl_Position = projectedPosition;


        float size = 2.0;

        gl_PointSize = size;
        // Size attenuation
        // gl_PointSize *= (1.0 / -viewPosition.z);


        vUv = uv;
    }
`