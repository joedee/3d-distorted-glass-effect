import React, { useRef } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { Color } from 'three';
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'

export default function Model() {
    const { nodes } = useGLTF("/medias/torrus.glb");
    const { viewport } = useThree()
    const torus = useRef(null);
    
    // Calculate position for upper left corner
    const textX = -viewport.width / 1.75;  // Position from left
    const textY = viewport.height / 2;   // Position from top
    const textZ = 0;                       // Z position (depth)

    useFrame( () => {
            torus.current.rotation.z += 0.005   
            torus.current.rotation.x += 0.005
            torus.current.rotation.y += 0.005
    })

    const materialProps = useControls({
        thickness: { value: 0.15, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 2.6, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.00, min: 0, max: 1},
        backside: { value: true},
    })
    
    return (
        <group scale={viewport.width / 18} >
            <Text 
                font={'/fonts/Merriweather.ttf'} 
                position={[textX, textY, textZ]}
                fontSize={1.5} 
                color="black" 
                anchorX="left"
                anchorY="top"
                lineHeight={1.2}
                maxWidth={viewport.width / 1.4}
            >
                It&apos;s time to see health differently.
            </Text>            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps} background={new Color('#9ef0f0')}/>
            </mesh>
        </group>
    )
}