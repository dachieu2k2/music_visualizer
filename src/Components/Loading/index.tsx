import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { Mesh } from "three";

const Loading = () => {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    mesh.current!.rotation.set(
      clock.getElapsedTime(),
      clock.getElapsedTime(),
      clock.getElapsedTime()
    );
  });

  return (
    <mesh ref={mesh} scale={0.1}>
      <torusGeometry args={[5, 2]} />
      <meshNormalMaterial />
    </mesh>
  );
};

export default Loading;
