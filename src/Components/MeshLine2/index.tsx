import { useEffect, useMemo, useRef } from "react";
import { extendMeshLine } from "../../config/meshline";
import {
  AdditiveBlending,
  Audio,
  AudioAnalyser,
  Points,
  ShaderMaterial,
  Vector4,
} from "three";
import { MeshLineGeometry } from "meshline";
import { PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { fragment } from "./fragment";
import { vertex } from "./vertex";

extendMeshLine();

export function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function normalizeBetween(val: number, min: number, max: number) {
  return (val - min) / (max - min);
}
const vec4 = new Vector4();

const MeshLine2 = () => {
  const lineRef = useRef<MeshLineGeometry>(null);
  const points = useRef<Points>(null);
  const sound = useRef<Audio<AudioNode>>(null);
  const analyser = useRef<AudioAnalyser | null>(null);

  const { lineWidth, color, segments, height, radius } = useControls(
    "MeshLine",
    {
      lineWidth: 0.02,
      color: "#fff",
      segments: 5,
      height: 1,
      radius: 2,
    },
    { collapsed: true }
  );

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uRadius: { value: radius },
      uMusicData: { value: [] },
    }),
    []
  );

  useEffect(() => {
    if (sound.current) {
      console.log(sound);

      analyser.current = new AudioAnalyser(sound.current, 32);
      console.log(analyser.current);
    }
  }, [sound]);

  // const points = useMemo(() => {
  //   const p = [];
  //   for (let i = 0; i <= segments / 2; i++) {
  //     p.push(i, 0, 0);
  //     p.push(-i, 0, 0);
  //   }
  //   return p;
  // }, []);

  const count = 200;
  // const radius = 5;
  const particlesProperty = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = i;
      const y = 0;
      const z = 0;
      positions.set([x, y, z], i * 3);
      colors.set([Math.random(), Math.random(), Math.random()], i * 3);
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!analyser.current) {
      return;
    }

    const { clock } = state;

    const data = analyser.current.getAverageFrequency();
    const dataArr = analyser.current.data;

    // (points.current?.material as ShaderMaterial).uniforms.uTime.value =
    //   clock.getElapsedTime();
    // (points.current?.material as ShaderMaterial).uniforms.uMusicData.value =
    //   dataArr;

    const p = [];
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const val = normalizeBetween(dataArr[i % 16], 0, 200);
      // const x = val;
      const x = i;
      const y = val;
      const z = 0;
      positions.set([x, y, z], i * 3);
    }
    (points.current?.geometry.attributes as unknown as any).position.array.set(
      positions
    );
    (
      points.current?.geometry.attributes as unknown as any
    ).position.needsUpdate = true;
  });

  return (
    <>
      <mesh scale={0.95}>
        <meshLineGeometry
          ref={lineRef}
          // points={points}
        />
        <meshLineMaterial
          lineWidth={lineWidth}
          color={color}
          // depthWrite={false}
          // dashArray={0.25}
          // transparent={true}
          toneMapped={false}
          // wireframe={true}
          sizeAttenuation={0.2}
        />
        <PositionalAudio url={"/chimsau.mp3"} autoplay ref={sound} loop />
      </mesh>

      <points ref={points} scale={0.1}>
        <bufferGeometry>
          <bufferAttribute
            attach={"attributes-position"}
            count={particlesProperty.positions.length / 3}
            array={particlesProperty.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach={"attributes-color"}
            count={particlesProperty.colors.length / 3}
            array={particlesProperty.colors}
            itemSize={3}
          />
        </bufferGeometry>

        {/* <shaderMaterial
          blending={AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragment}
          vertexShader={vertex}
          uniforms={uniforms}
        /> */}

        <pointsMaterial
          // map={colorMap}
          transparent={true}
          size={0.04}
          depthTest={false}
          depthWrite={false}
          blending={AdditiveBlending}
          //   color={"white"}
          sizeAttenuation={true}
          vertexColors={true}
        />
      </points>
    </>
  );
};

export default MeshLine2;
