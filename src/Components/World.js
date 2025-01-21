import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { animated, useSpring } from "@react-spring/three";

function WalkingMan({ position, rotation }) {
  const group = useRef();
  const { scene, animations } = useGLTF("/walking-man.glb");
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  useEffect(() => {
    if (animations.length) {
      const action = mixer.clipAction(animations[0]);
      action.play();
    }
  }, [animations, mixer]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return (
    <animated.primitive
      ref={group}
      object={scene}
      position={position}
      scale={[0.3, 0.3, 0.3]}
      rotation={[0, rotation, 0]}
    />
  );
}

function City() {
  const group = useRef();
  const { scene } = useGLTF("/city.glb");

  // Load the image as a texture
  const texture = new THREE.TextureLoader().load("/bank.jpg");
  const texture1 = new THREE.TextureLoader().load("/market.webp");

  return (
    <>
      <primitive
        ref={group}
        object={scene}
        position={[-20, -0.2, -45]}
        scale={[1.5, 1.5, 1.5]}
      />

      {/* Add the image as a plane */}
      <mesh position={[10, 6, -50]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[10, 5]} /> {/* Width: 10, Height: 5 */}
        <meshBasicMaterial map={texture} transparent />
      </mesh>

      <mesh position={[34, 6, -50]} rotation={[0, 3*Math.PI/2, 0]}>
        <planeGeometry args={[10, 5]} /> {/* Width: 10, Height: 5 */}
        <meshBasicMaterial map={texture1} transparent />
      </mesh>
    </>
  );
}

function CameraController({ targetPosition, rotation }) {
  const { camera } = useThree();

  useFrame(() => {
    const [x, y, z] = targetPosition.get();
    const offsetX = Math.sin(rotation) * 10;
    const offsetZ = Math.cos(rotation) * 10;
    const targetVector = new THREE.Vector3(x, y, z);

    camera.position.lerp(new THREE.Vector3(x - offsetX, y + 5, z - offsetZ), 1);
    camera.lookAt(targetVector);
  });

  return null;
}

function World() {
  const [animatedPosition, setAnimatedPosition] = useState([0, 0, 5]);
  const [rotation, setRotation] = useState(Math.PI); // Initial facing direction

  const { pos, rot } = useSpring({
    pos: animatedPosition,
    rot: rotation,
    config: { tension: 120, friction: 20 },
  });

  const checkProximity = (walkingPosition, imagePosition) => {
    const distance = new THREE.Vector3(...walkingPosition)
      .distanceTo(new THREE.Vector3(...imagePosition));
      console.log(distance)
    return distance <= 25 && distance >= 22;
  };
  const checkProximity1 = (walkingPosition, imagePosition) => {
    const distance = new THREE.Vector3(...walkingPosition)
      .distanceTo(new THREE.Vector3(...imagePosition));
      console.log(distance)
    return distance <= 8;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setAnimatedPosition((prev) => [
            prev[0] + Math.sin(rotation),
            prev[1],
            prev[2] + Math.cos(rotation),
          ]);
          break;
        case "ArrowDown":
          setAnimatedPosition((prev) => [
            prev[0] - Math.sin(rotation),
            prev[1],
            prev[2] - Math.cos(rotation),
          ]);
          break;
        case "ArrowLeft":
          setRotation((prev) => prev + Math.PI / 8); // Rotate left
          break;
        case "ArrowRight":
          setRotation((prev) => prev - Math.PI / 8); // Rotate right
          break;
        case " ":
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
  }, [rotation]);

  useEffect(() => {
    const walkingPosition = animatedPosition;
    const imagePosition = [-10, 5, -40];
    const imagePosition1 = [34, 6, -50]; // Image plane position

    if (checkProximity(walkingPosition, imagePosition)) {
      window.open("https://hdfc.com", "_blank");
    }
    if (checkProximity1(walkingPosition, imagePosition1)) {
      window.open("https://amazon.com", "_blank");
    }
  }, [animatedPosition])

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "black" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 70 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <CameraController targetPosition={pos} rotation={rotation} />

        <City />
        <WalkingMan
          position={pos.to((x, y, z) => [x, y, z])}
          rotation={rotation}
        />

        <mesh position={[0, 50, -50]}>
          <sphereGeometry args={[100, 32, 32]} />
          <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
        </mesh>
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 90,
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
        <p>Arrow Left: Rotate Left</p>
        <p>Arrow Right: Rotate Right</p>
        <p>Space: Jump</p>
      </div>
    </div>
  );
}

export default World;
