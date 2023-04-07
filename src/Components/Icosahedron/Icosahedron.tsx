import { PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import {
  Audio,
  AudioAnalyser,
  Camera,
  Color,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  ShaderMaterial,
  Vector3,
} from "three";
import { fragmentShader } from "./FragmentShader";
import { vertexShader } from "./VertexShader";
const t = new Color();
const v = new Vector3();

const Icosahedron = () => {
  const mesh = useRef<Mesh>(null);
  const analyser = useRef<AudioAnalyser | null>(null);
  const hover = useRef(false);

  //   useEffect(() => void (analyser.current = new AudioAnalyser(sound, 32)), []);

  //   const audio = new Audio(chimsau)

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

  let i = 0;
  useFrame((state) => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      t.setRGB(0.5, data / 100, 0.5);
      if (i < 10) {
        console.log(data);
        i++;
        console.log(t);
      }

      // (mesh.current!.material as MeshBasicMaterial).color.set(t);
      mesh.current!.scale.x =
        mesh.current!.scale.y =
        mesh.current!.scale.z =
          (data / 100) * 2;

      // state.camera as any).fov = 25 - data.avg / 15;
      //     state.camera.updateProjectionMatrix();

      //   v.set(0, 0, 4.5 + data / 100);
      //   (state.camera as PerspectiveCamera).position.set(v.x, v.y, v.z);

      (mesh.current?.material as ShaderMaterial).uniforms.u_time.value =
        0.4 * state.clock.getElapsedTime();
      (mesh.current?.material as ShaderMaterial).uniforms.u_intensity.value =
        MathUtils.lerp(
          (mesh.current?.material as ShaderMaterial).uniforms.u_intensity.value,
          hover.current ? 0.85 : 0.15,
          0.02
        );

      // if (mesh.current) {
      //   state.camera.position.x =
      //     Math.sin(state.clock.getElapsedTime() * 0.63) * 2.7;
      //   state.camera.position.y =
      //     Math.sin(state.clock.getElapsedTime() * 0.84) * 2.15;
      //   state.camera.position.z =
      //     Math.cos(state.clock.getElapsedTime() * 0.39) * 4.5;
      //   state.camera.lookAt(mesh.current.position);
      //   state.camera.updateProjectionMatrix();
      // }

      (mesh.current!.material as MeshBasicMaterial).needsUpdate = true;
    }
  });

  return (
    <>
      {/* <Suspense fallback={null}> */}
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
        <PositionalAudio url={"/chimsau.mp3"} autoplay ref={sound} loop />
      </mesh>
      {/* </Suspense> */}
    </>
  );
};

export default Icosahedron;
