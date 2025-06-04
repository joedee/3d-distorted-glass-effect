import React, { useRef, useEffect, useState } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function Model() {
    const { nodes } = useGLTF("/medias/torrus.glb");
    const { viewport } = useThree()
    const torus = useRef(null);
    const [rotationAxis] = useState(() => new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    ).normalize());
    const [rotationSpeed] = useState(() => 0.01 + Math.random() * 0.03);
    const [lastChange] = useState(() => Date.now());
    
    useFrame(() => {
        if (!torus.current) return;
        
        // Rotate the object
        torus.current.rotation.x += rotationAxis.x * rotationSpeed;
        torus.current.rotation.y += rotationAxis.y * rotationSpeed;
        torus.current.rotation.z += rotationAxis.z * rotationSpeed;
        
        // Change rotation axis randomly every few seconds
        const now = Date.now();
        if (now - lastChange > 5000) { // Change every 5 seconds
            const newAxis = new THREE.Vector3(
                Math.random() * 2 - 1,
                Math.random() * 2 - 1,
                Math.random() * 2 - 1
            ).normalize();
            rotationAxis.lerp(newAxis, 0.1); // Smooth transition to new rotation axis
        }
    })

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
    })
    
    return (
        <group scale={viewport.width / 20} >
            <Text font={'/fonts/Merriweather.ttf'} position={[0, 0, -1]} fontSize={1.5} color="white" anchorX="center" anchorY="middle">
                It&apos;s time to see health differently.
            </Text>
            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
}
