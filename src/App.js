import React, { Suspense, useState } from "react";
import { Canvas, extend } from "react-three-fiber";
import "./styles.css";
import { useGLTF, OrbitControls, Effects } from "@react-three/drei";
import * as THREE from "three";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { WaterPass } from "./Waterpass";
import url from "./ghosttown.mp4";

extend({ WaterPass, GlitchPass, BloomPass });

const TV = () => {
  const { nodes } = useGLTF("tv.gltf");

  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src = url;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  return (
    <group rotation={[Math.PI / 8, Math.PI * 1.2, 0]}>
      <mesh geometry={nodes.TV.geometry}>
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 1.1]}>
        <planeGeometry args={[3.2, 1.9]} />
        <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>
          <videoTexture attach="map" args={[video]} />
          <videoTexture attach="emissiveMap" args={[video]} />
        </meshStandardMaterial>
      </mesh>
    </group>
  );
};

const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, -2, 0]}>
      <planeBufferGeometry args={[100, 100, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

export default function App() {
  return (
    <Canvas>
      <Effects>
        <waterPass attachArray="passes" factor={1} />
        <bloomPass attachArray="passes" />
        <glitchPass attachArray="passes" />
      </Effects>
      <OrbitControls maxPolarAngle={Math.PI / 2} minPolarAngle={0} />

      <fog attach="fog" args={["black", 1, 7]} />
      <directionalLight intensity={0.05} />
      <pointLight intensity={0.2} color="red" />

      <Suspense fallback={null}>
        <TV />
        <Floor />
      </Suspense>
    </Canvas>
  );
}
