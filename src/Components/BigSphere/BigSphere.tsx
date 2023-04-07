import React, { useMemo, useRef } from "react";
import { fragmentShader } from "./fragmentShader";
import { vertexShader } from "./vertexShader";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Mesh, ShaderMaterial } from "three";
import { useControls } from "leva";

const BigSphere = () => {
  const mesh = useRef<Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  );

  // debug

  const {
    wireframe,
    doubleSide,
    color,
    width,
    height,
    widthSegments,
    heightSegements,
  } = useControls("BigSphere", {
    color: "white",
    width: 1,
    height: 1,
    widthSegments: { value: 32, min: 0, max: 64, step: 8 },
    heightSegements: { value: 32, min: 0, max: 64, step: 8 },
    wireframe: true,
    doubleSide: false,
  });

  useFrame(({ clock }) => {
    (mesh.current?.material as ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[6.5, 120, 60]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={wireframe}
        side={doubleSide ? DoubleSide : undefined}
        transparent={true}
        opacity={0.1}
      />
    </mesh>
  );
};

export default BigSphere;
