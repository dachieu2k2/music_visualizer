import { useEffect, useMemo, useRef } from "react";
import { extendMeshLine } from "../../config/meshline";
import { Audio, AudioAnalyser } from "three";
import { MeshLineGeometry } from "meshline";
import { PositionalAudio } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

extendMeshLine();

export function radians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function normalizeBetween(val: number, min: number, max: number) {
  return (val - min) / (max - min);
}

const config = {
  lineWidth: 0.04,
  color: 0xfffff,
  segments: 100,
  height: 1,
  radius: 2,
};

const MeshLine = () => {
  const lineRef = useRef<MeshLineGeometry>(null);
  const sound = useRef<Audio<AudioNode>>(null);
  const analyser = useRef<AudioAnalyser | null>(null);

  useEffect(() => {
    if (sound.current) {
      console.log(sound);

      analyser.current = new AudioAnalyser(sound.current, 32);
      console.log(analyser.current);
    }
  }, [sound]);

  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i <= config.segments; i++) {
      const theta = (i / config.segments) * Math.PI * 2;
      p.push(
        // new Vector3(
        Math.cos(theta) * config.radius,
        Math.sin(theta) * config.radius,
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
    const dataArr = analyser.current.data.slice(4);
    // const fft = analyser.current.getFft();
    // console.log(dataArr);

    const p = [];
    for (let i = 0; i <= config.segments; i++) {
      // const angle = i * (360 / config.segments);
      // const theta = radians(angle);

      const theta = (i / config.segments) * Math.PI * 2;
      const val = normalizeBetween(dataArr[i % 12] / 10, 0, 100);
      const x = (config.radius + val) * Math.cos(theta);
      const y = -(config.radius + val) * Math.sin(theta);
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
      <mesh>
        <meshLineGeometry ref={lineRef} points={points} />
        <meshLineMaterial
          lineWidth={config.lineWidth}
          color="white"
          // depthWrite={false}
          dashArray={0.25}
          transparent={true}
          toneMapped={false}
          // wireframe={true}
          sizeAttenuation={0.2}
        />
        <PositionalAudio url={"/chimsau.mp3"} autoplay ref={sound} loop />
      </mesh>
    </>
  );
};

export default MeshLine;
