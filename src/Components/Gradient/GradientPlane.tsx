import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, DoubleSide, Mesh, ShaderMaterial, Vector2 } from "three";
import { fragmentShader } from "./FragmentShader";
import { vertexShader } from "./vertexShader";

const GradientPlane = () => {
  const mesh = useRef<Mesh>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  const updateMousePosition = useCallback((e: MouseEvent) => {
    mousePosition.current = { x: e.pageX, y: e.pageY };
  }, []);

  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_mouse: { value: new Vector2(0, 0) },
      u_bg: { value: new Color("#A1A3F7") },
      u_colorA: { value: new Color("#9FBAF9") },
      u_colorB: { value: new Color("#FEB3D9") },
    }),
    []
  );
  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition, false);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition, false);
    };
  }, [updateMousePosition]);

  useFrame((state) => {
    const { clock } = state;

    (mesh.current?.material as ShaderMaterial).uniforms.u_time.value =
      clock.getElapsedTime();
    (mesh.current?.material as ShaderMaterial).uniforms.u_mouse.value =
      new Vector2(mousePosition.current.x, mousePosition.current.y);
  });
  return (
    <mesh
      ref={mesh}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={1}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        // wireframe
        side={DoubleSide}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default GradientPlane;
