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
        thickness: { value: 0.1, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.5, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1, step: 0.01 }, // Slightly increased default for visibility
        backside: { value: true},
        color: { value: '#ffffff' },
        distortion: { value: 0.2, min: 0, max: 1, step: 0.01 },
        distortionScale: { value: 0.5, min: 0, max: 1, step: 0.01 },
        temporalDistortion: { value: 0.0, min: 0, max: 1, step: 0.01 }, // Default to 0 (off)
        attenuationDistance: { value: 0.75, min: 0, max: 2, step: 0.01 }, // Default to 0.5, adjust as needed
        attenuationColor: { value: '#ffffff' } // Color light shifts to, often white or a light tint
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