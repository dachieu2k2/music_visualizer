import { useEffect, useMemo, useRef } from "react";
import { extendMeshLine } from "../../config/meshline";
import { Audio, AudioAnalyser } from "three";
import { MeshLineGeometry } from "meshline";
import { PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

extendMeshLine();

export function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function normalizeBetween(val: number, min: number, max: number) {
  return (val - min) / (max - min);
}

// const config = {
//   lineWidth: 0.02,
//   color: 0xfffff,
//   segments: 1600,
//   height: 1,
//   radius: 2,
// };

const MeshLine = () => {
  const lineRef = useRef<MeshLineGeometry>(null);
  const sound = useRef<Audio<AudioNode>>(null);
  const analyser = useRef<AudioAnalyser | null>(null);

  const { lineWidth, color, segments, height, radius } = useControls(
    "MeshLine",
    {
      lineWidth: 0.02,
      color: "#fff",
      segments: 208,
      height: 1,
      radius: 2,
    },
    { collapsed: true }
  );

  useEffect(() => {
    if (sound.current) {
      console.log(sound);

      analyser.current = new AudioAnalyser(sound.current, 32);
      console.log(analyser.current);
    }
  }, [sound]);

  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      p.push(
        // new Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        0
        // )
      );
    }
    return p;
  }, []);

  useFrame((state) => {
    if (!analyser.current) {
      return;
    }

    const data = analyser.current.getAverageFrequency();
    // const dataArr = analyser.current.data.slice(4);
    const dataArr = analyser.current.data;
    // const fft = analyser.current.getFft();
    // console.log(dataArr);

    const p = [];
    for (let i = 0; i <= segments; i++) {
      // const angle = i * (360 / segments);
      // const theta = radians(angle);

      const theta = (i / segments) * Math.PI * 2;
      const val = normalizeBetween(dataArr[i % 16] / 10, 0, 100);
      const x = (radius + val) * Math.cos(theta);
      const y = -(radius + val) * Math.sin(theta);
      // console.log(analyser.current.data, val);

      // if (i == 10)  console.log(val);

      // break;

      p.push(x, y, 0);
    }
    // return;
    lineRef.current?.setPoints(p);
  });

  return (
    <>
      {/* <effectComposer>
       <Bloom mipmapBlur luminanceThreshold={1} radius={0.6} />
    </effectComposer> */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <meshLineGeometry ref={lineRef} points={points} />
        <meshLineMaterial
          lineWidth={lineWidth}
          color={color}
          // depthWrite={false}
          // dashArray={0.25}
          // transparent={true}
          toneMapped={false}
          // wireframe={true}
          sizeAttenuation={0.2}
        />
        <PositionalAudio url={"/chimsau.mp3"} autoplay ref={sound} loop />
      </mesh>

      <mesh scale={0.95}>
        <meshLineGeometry points={points} />
        <meshLineMaterial
          lineWidth={lineWidth}
          color={color}
          // depthWrite={false}
          // dashArray={0.25}
          // transparent={true}
          toneMapped={false}
          // wireframe={true}
          sizeAttenuation={0.2}
        />
      </mesh>
    </>
  );
};

export default MeshLine;
