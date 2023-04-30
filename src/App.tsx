import { useState, lazy, Suspense } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls, Stars } from "@react-three/drei";
import { button, useControls } from "leva";
import { BackSide, Color, Vector3 } from "three";
import BigSphere from "./Components/BigSphere/BigSphere";
// import Icosahedron from "./Components/Icosahedron/Icosahedron";

const Icosahedron = lazy(() => import("./Components/Icosahedron/Icosahedron"));
import MeshLine from "./Components/MeshLine";
import MeshLine2 from "./Components/MeshLine2";
import ResponsiveCamera from "./Components/ReponsiveCamera";
import Loading from "./Components/Loading";

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
const vec3 = new Vector3(0, 5, 0);

function App() {
  const [state, setState] = useState<boolean>(false);
  return (
    <main>
      <a
        href="https://github.com/dachieu2k2"
        className="top-left"
        children="MUSIC VISUALIZER"
      ></a>
      <a
        href="https://www.facebook.com/hieu.hiihihaha/"
        className="top-right"
        children="@facebook"
      />
      <a
        href="https://github.com/pmndrs/react-three-fiber"
        className="bottom-left"
        children="@react-three/fiber"
      />
      <a
        href="https://github.com/dachieu2k2"
        className="bottom-right"
        children="@github"
      />

      {state ? (
        <Canvas camera={{ fov: 75 }}>
          <color attach={"background"} args={["#0d021f"]} />
          <Suspense fallback={<Loading />}>
            <group>
              <Icosahedron />
              <ResponsiveCamera />
              <BigSphere />
            </group>
            <perspectiveCamera />
          </Suspense>
        </Canvas>
      ) : (
        <>
          <button
            className="button"
            role="button"
            onClick={() => setState(true)}
          >
            Let's start!
          </button>
        </>
        // <button >Let's start!</button>
      )}
    </main>
  );
}

export default App;
