import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Plane from "./Components/Plane/Plane";
import { Environment, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import Geometries from "./Components/Refraction/Mesh";
import { BackSide, Color } from "three";
import BigSphere from "./Components/BigSphere/BigSphere";
import Icosahedron from "./Components/Icosahedron/Icosahedron";

const config = {
  backgroundColor: new Color("#0d021f"),
  cameraSpeed: 0,
  cameraRadius: 4.5,
  particlesSpeed: 0,
  particlesCount: 3000,
  bloomStrength: 1.45,
  bloomThreshold: 0.34,
  bloomRadius: 0.5,
};

function App() {
  const { orbitcontrols, axesHelper } = useControls("mainControls", {
    orbitcontrols: true,
    axesHelper: false,
  });
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 4.5] }}>
      <color attach={"background"} args={["#0d021f"]} />
      {/* <Plane /> */}
      {/* <directionalLight color={"white"} position={[1, 1, 1]} />
       */}
      <group>
        <Icosahedron />
        {/* <mesh>
          <sphereGeometry args={[6.5, 120, 60]} />
          <shaderMaterial
            vertexShader=""
            fragmentShader=""
            side={BackSide}
            wireframe={true}
            transparent={true}
            opacity={0.1}
            // uniforms={
            //   uTime: { value: 0 }
            // }}
          />
        </mesh> */}
        <BigSphere />
      </group>
      {/* <Geometries /> */}
      <perspectiveCamera />
      {orbitcontrols && <OrbitControls />}
      {axesHelper && <axesHelper />}
    </Canvas>
  );
}

export default App;
