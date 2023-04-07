import React, { useMemo, useRef } from "react";
import { fragmentShader } from "./fragmentShader";
import { vertexShader } from "./vertexShader";
import { useFrame } from "@react-three/fiber";
import { Mesh, ShaderMaterial } from "three";

const Plane = () => {
  const mesh = useRef<Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    (mesh.current?.material as ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Plane;
