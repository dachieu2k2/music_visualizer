import { Environment, Html, PositionalAudio, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Audio,
  AudioAnalyser,
  Camera,
  Color,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  ShaderMaterial,
  Vector3,
} from "three";
import { fragmentShader } from "./FragmentShader";
import { vertexShader } from "./VertexShader";
import { MeshLineGeometry } from "meshline";
import { useControls } from "leva";
import { extendMeshLine } from "../../config/meshline";
import { normalizeBetween } from "../MeshLine";

const t = new Color();
const v = new Vector3();

extendMeshLine();

const Icosahedron = () => {
  const lineRef = useRef<MeshLineGeometry>(null);
  const linePointsRef = useRef<Points>(null);
  const mesh = useRef<Mesh>(null);
  const starsMesh = useRef<Mesh>(null);
  const pointsMesh = useRef<Points>(null);
  const analyser = useRef<AudioAnalyser | null>(null);
  const hover = useRef(false);

  // useEffect(() => void (analyser.current = new AudioAnalyser(sound, 32)), []);

  //   const audio = new Audio(chimsau)

  const { lineWidth, color, segments, height, radius } = useControls(
    "MeshLine",
    {
      lineWidth: 0.02,
      color: "#fff",
      segments: 32,
      height: 1,
      radius: 2,
    },
    { collapsed: true }
  );

  const sound = useRef<Audio<AudioNode>>(null);
  console.log(sound);

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.3,
      },
      u_time: {
        value: 0.0,
      },
      u_musicData: {
        value: 0.0,
      },
    }),
    []
  );

  const points = useMemo(() => {
    const p = [];
    const positions = new Float32Array(segments * 3);

    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      p.push(
        // new Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        0
        // )
      );
      positions.set(
        [Math.cos(theta) * radius, Math.sin(theta) * radius, 0],
        i * 3
      );
    }
    return { p, positions };
  }, []);

  useEffect(() => {
    if (sound.current) {
      console.log(sound);

      analyser.current = new AudioAnalyser(sound.current, 32);
      console.log(analyser.current);
    }
  }, [sound]);

  let i = 0;

  useFrame((state) => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();

      const dataArr = analyser.current.data;

      t.setRGB(0.5, data / 100, 0.5);
      if (i < 10) {
        console.log(data, analyser.current.data);
        i++;
        console.log(t);
      }

      // (mesh.current!.material as MeshBasicMaterial).color.set(t);
      mesh.current!.scale.x =
        mesh.current!.scale.y =
        mesh.current!.scale.z =
          (data / 100) * 1.5;

      pointsMesh.current!.scale.x =
        pointsMesh.current!.scale.y =
        pointsMesh.current!.scale.z =
          (data / 100) * 1.5;

      pointsMesh.current!.rotation.set(
        state.clock.getElapsedTime() * 0.2,
        state.clock.getElapsedTime() * 0.2,
        state.clock.getElapsedTime() * 0.2
      );

      starsMesh.current!.scale.x =
        starsMesh.current!.scale.y =
        starsMesh.current!.scale.z =
          (data / 100) * 3;

      // lineRef.current!.scale.x =
      //   lineRef.current!.scale.y =
      //   lineRef.current!.scale.z =
      //     (data / 100) * 3;

      //

      const p = [];
      for (let i = 0; i <= segments; i++) {
        // const angle = i * (360 / segments);
        // const theta = radians(angle);

        const theta = (i / segments) * Math.PI * 2;
        const val = normalizeBetween(dataArr[i % 16], 0, 85);
        const x = (radius + val) * Math.cos(theta);
        const y = -(radius + val) * Math.sin(theta);
        // console.log(analyser.current.data, val);

        // if (i == 10)  console.log(val);

        // break;

        const i3 = i * 3;

        (linePointsRef.current!.geometry.attributes.position.array[
          i3 + 0
        ] as number) = x;
        (linePointsRef.current!.geometry.attributes.position.array[
          i3 + 1
        ] as number) = y;
        (linePointsRef.current!.geometry.attributes.position.array[
          i3 + 2
        ] as number) = (data / 100) * 1.5;

        p.push(x, y, (data / 100) * 1.5);
      }
      // return;
      lineRef.current?.setPoints(p);

      //

      (
        linePointsRef.current!.geometry.attributes as unknown as any
      ).position.needsUpdate = true;

      (mesh.current?.material as ShaderMaterial).uniforms.u_time.value =
        0.4 * state.clock.getElapsedTime();

      (mesh.current?.material as ShaderMaterial).uniforms.u_musicData.value =
        data;

      (mesh.current?.material as ShaderMaterial).uniforms.u_intensity.value =
        MathUtils.lerp(
          (mesh.current?.material as ShaderMaterial).uniforms.u_intensity.value,
          hover.current ? 0.85 : 0.15,
          0.02
        );

      (mesh.current!.material as MeshBasicMaterial).needsUpdate = true;
    }
  });

  return (
    <>
      <>
        <Environment preset="night" />
        <mesh
          ref={mesh}
          onPointerOver={() => (hover.current = true)}
          onPointerOut={() => (hover.current = false)}
        >
          <icosahedronGeometry args={[1.2, 10]} />
          {/* <meshBasicMaterial
          color={0xffffff}
          wireframe={true}
          transparent={true}
          opacity={0.5}
        /> */}

          <shaderMaterial
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            uniforms={uniforms}
            // wireframe={true}
            transparent={true}
            opacity={0.5}
          />
        </mesh>
        <points ref={pointsMesh}>
          <icosahedronGeometry args={[1.5, 10]} />
          <pointsMaterial
            size={0.02}
            blending={AdditiveBlending}
            // depthTest={false}
            // depthWrite={false}
          />
        </points>
        <Stars count={1000} ref={starsMesh} saturation={1200} />

        <points ref={linePointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach={"attributes-position"}
              count={points.positions.length / 3}
              array={points.positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial size={0.08} blending={AdditiveBlending} />
        </points>

        {/* <mesh rotation={[0, 0, Math.PI / 2]}>
          <meshLineGeometry ref={lineRef} points={points.p} />
          <meshLineMaterial
            lineWidth={lineWidth}
            color={color}
            sizeAttenuation={0.2}
          />
        </mesh> */}

        <PositionalAudio url={"/chimsau.mp3"} autoplay ref={sound} loop />
      </>
    </>
  );
};

export default Icosahedron;
