import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React from "react";

const ResponsiveCamera = () => {
  const { x, y, z } = {
    x: -20 + 8,
    y: 45 + 8,
    z: 30 + 8,
  };
  const { size, camera } = useThree((state) => state);

  if (size.width <= 768) {
    camera.position.set(0, 0, 10);
  }

  return <></>;
};

export default ResponsiveCamera;
