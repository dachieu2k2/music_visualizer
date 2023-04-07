import { OrbitControls, useFBO, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, folder, useControls } from "leva";
import { useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import vertexShader from "./VerTexShader";
import fragmentShader from "./FragmentShader";
import {
  Group,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
  BackSide,
  FrontSide,
} from "three";

const Geometries = () => {
  // This reference gives us direct access to our mesh
  const mesh = useRef<Mesh>(null);
  const backgroundGroup = useRef<Group>(null);

  // This is our main render target where we'll render and store the scene as a texture
  const mainRenderTarget = useFBO();
  const backRenderTarget = useFBO();

  const {
    light,
    shininess,
    diffuseness,
    fresnelPower,
    iorR,
    iorY,
    iorG,
    iorC,
    iorB,
    iorP,
    saturation,
    chromaticAberration,
    refraction,
  } = useControls({
    light: {
      value: new Vector3(-1.0, 1.0, 1.0) as any,
    },
    diffuseness: {
      value: 0.2,
    },
    shininess: {
      value: 15.0,
    },
    fresnelPower: {
      value: 8.0,
    },
    ior: folder({
      iorR: { min: 1.0, max: 2.333, step: 0.001, value: 1.15 },
      iorY: { min: 1.0, max: 2.333, step: 0.001, value: 1.16 },
      iorG: { min: 1.0, max: 2.333, step: 0.001, value: 1.18 },
      iorC: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorB: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
      iorP: { min: 1.0, max: 2.333, step: 0.001, value: 1.22 },
    }),
    saturation: { value: 1.14, min: 1, max: 1.25, step: 0.01 },
    chromaticAberration: {
      value: 0.5,
      min: 0,
      max: 1.5,
      step: 0.01,
    },
    refraction: {
      value: 0.25,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const uniforms = useMemo(
    () => ({
      uTexture: {
        value: null,
      },
      uIorR: { value: 1.0 },
      uIorY: { value: 1.0 },
      uIorG: { value: 1.0 },
      uIorC: { value: 1.0 },
      uIorB: { value: 1.0 },
      uIorP: { value: 1.0 },
      uRefractPower: {
        value: 0.2,
      },
      uChromaticAberration: {
        value: 1.0,
      },
      uSaturation: { value: 0.0 },
      uShininess: { value: 40.0 },
      uDiffuseness: { value: 0.2 },
      uFresnelPower: { value: 8.0 },
      uLight: {
        value: new Vector3(-1.0, 1.0, 1.0),
      },
      winResolution: {
        value: new Vector2(
          window.innerWidth,
          window.innerHeight
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)), // if DPR is 3 the shader glitches 🤷‍♂️
      },
    }),
    []
  );

  useFrame((state) => {
    const { gl, scene, camera } = state;

    mesh.current!.visible = false;

    (mesh.current?.material as ShaderMaterial).uniforms.uDiffuseness.value =
      diffuseness;
    (mesh.current?.material as ShaderMaterial).uniforms.uShininess.value =
      shininess;
    (mesh.current?.material as ShaderMaterial).uniforms.uLight.value =
      new Vector3(light.x, light.y, light.z);
    (mesh.current?.material as ShaderMaterial).uniforms.uFresnelPower.value =
      fresnelPower;

    (mesh.current?.material as ShaderMaterial).uniforms.uIorR.value = iorR;
    (mesh.current?.material as ShaderMaterial).uniforms.uIorY.value = iorY;
    (mesh.current?.material as ShaderMaterial).uniforms.uIorG.value = iorG;
    (mesh.current?.material as ShaderMaterial).uniforms.uIorC.value = iorC;
    (mesh.current?.material as ShaderMaterial).uniforms.uIorB.value = iorB;
    (mesh.current?.material as ShaderMaterial).uniforms.uIorP.value = iorP;

    (mesh.current?.material as ShaderMaterial).uniforms.uSaturation.value =
      saturation;
    (
      mesh.current?.material as ShaderMaterial
    ).uniforms.uChromaticAberration.value = chromaticAberration;
    (mesh.current?.material as ShaderMaterial).uniforms.uRefractPower.value =
      refraction;

    gl.setRenderTarget(backRenderTarget);
    gl.render(scene, camera);

    (mesh.current?.material as ShaderMaterial).uniforms.uTexture.value =
      backRenderTarget.texture;
    (mesh.current?.material as ShaderMaterial).side = BackSide;

    mesh.current!.visible = true;

    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    (mesh.current?.material as ShaderMaterial).uniforms.uTexture.value =
      mainRenderTarget.texture;
    (mesh.current?.material as ShaderMaterial).side = FrontSide;

    gl.setRenderTarget(null);
  });

  return (
    <>
      {/* <group ref={backgroundGroup} visible={false}>
        <mesh position={[-4, -3, -4]}>
          <icosahedronGeometry args={[2, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[4, -3, -4]}>
          <icosahedronGeometry args={[2, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[-5, 3, -4]}>
          <icosahedronGeometry args={[2, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <mesh position={[5, 3, -4]}>
          <icosahedronGeometry args={[2, 16]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </group> */}
      <mesh ref={mesh} scale={0.2}>
        <torusGeometry args={[3, 1, 32, 100]} />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};

export default Geometries;
