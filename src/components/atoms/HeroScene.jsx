import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from '@react-three/drei';

const Scene = () => {
    return (
        <Canvas>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 1, 1]} />
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere args={[1, 100, 200]} scale={2}>
                    <MeshDistortMaterial
                        color="#544F7D"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0}
                    />
                </Sphere>
            </Float>
            <Float speed={3} rotationIntensity={2} floatIntensity={1}>
                <Sphere args={[0.2, 100, 200]} scale={1} position={[2, 1, 0]}>
                    <MeshWobbleMaterial
                        color="#FFCB50"
                        attach="material"
                        factor={1}
                        speed={3}
                    />
                </Sphere>
            </Float>
        </Canvas>
    );
};

export default Scene;
