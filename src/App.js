import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";

function WalkingMan({ position }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/walking-man.glb");
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  // Play animations
  useEffect(() => {
    if (animations.length) {
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
  }, [animations, mixer]);

  // Update animations
  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return <animated.primitive ref={group} object={scene} position={position} scale={[0.3, 0.3, 0.3]} rotation={[0, Math.PI, 0]}/>;
}

function App() {
  const [animatedPosition, setAnimatedPosition] = useState([0, 0, 5]);

  // React-spring animation for position
  const { pos } = useSpring({
    pos: animatedPosition,
    config: { tension: 120, friction: 20 },
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp": // Move forward
          setAnimatedPosition((prev) => [prev[0], prev[1], prev[2] - 1]);
          break;
        case "ArrowDown": // Move backward
          setAnimatedPosition((prev) => [prev[0], prev[1], prev[2] + 1]);
          break;
        case "ArrowLeft": // Move left
          setAnimatedPosition((prev) => [prev[0] - 1, prev[1], prev[2]]);
          break;
        case "ArrowRight": // Move right
          setAnimatedPosition((prev) => [prev[0] + 1, prev[1], prev[2]]);
          break;
        case " ": // Jump
          setAnimatedPosition((prev) => [prev[0], prev[1] + 1, prev[2]]);
          setTimeout(() => {
            setAnimatedPosition((prev) => [prev[0], prev[1] - 1, prev[2]]);
          }, 500);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 70 }}>
        {/* Lights */}
        <ambientLight intensity={10} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {/* Background and Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#00364D" />
        </mesh>

        {/* Walking Man */}
        <WalkingMan position={pos.to((x, y, z) => [x, y, z])} />

        {/* Sky */}
        <mesh position={[0, 50, -50]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>
      </Canvas>

      {/* Controls Display */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0, 0, 0, 0.5)",
          padding: "10px",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        <h3>Controls:</h3>
        <p>Arrow Up: Move Forward</p>
        <p>Arrow Down: Move Backward</p>
        <p>Arrow Left: Move Left</p>
        <p>Arrow Right: Move Right</p>
        <p>Space: Jump</p>
      </div>
    </div>
  );
}

export default App;
