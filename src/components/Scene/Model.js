import React, { useRef, useState, useEffect, useCallback } from 'react'
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
        if (!isDragging && torus.current) { // Only apply automatic rotation if not dragging
            torus.current.rotation.x += 0.001;
            torus.current.rotation.y += 0.001;
            torus.current.rotation.z += 0.001;
        }
    })

    const [isDragging, setIsDragging] = useState(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    const handleGlobalPointerMove = useCallback((event) => {
        if (!isDragging || !torus.current) return;
        // No stopPropagation here as it's a global listener

        const deltaX = event.clientX - previousMousePosition.current.x;
        const deltaY = event.clientY - previousMousePosition.current.y;

        torus.current.rotation.y += deltaX * 0.0025; // Yaw (around Y-axis)
        torus.current.rotation.x += deltaY * 0.0025; // Pitch (around X-axis)
        torus.current.rotation.z += deltaX * 0.0015; // Roll (around Z-axis, influenced by horizontal drag, slightly less sensitive)

        previousMousePosition.current = { x: event.clientX, y: event.clientY };
    }, [isDragging]); // Dependency: isDragging ensures the closure has the latest state

    const handleGlobalPointerUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            // Optional: document.body.style.cursor = 'grab';
        }
    }, [isDragging]);

    const initiateDrag = (event) => { // Renamed: will be attached to background plane
        event.stopPropagation();
        setIsDragging(true);
        previousMousePosition.current = { x: event.clientX, y: event.clientY };
        // Optional: document.body.style.cursor = 'grabbing';
    };

    // Effect for adding/removing global listeners
    // Effect for initial torus rotation
    useEffect(() => {
        if (torus.current) {
            torus.current.rotation.x = Math.PI / 6; // 30 degrees on X-axis
            torus.current.rotation.y = Math.PI / 3; // 60 degrees on Y-axis
            torus.current.rotation.z = Math.PI / 4; // 45 degrees on Z-axis
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Effect for adding/removing global listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('pointermove', handleGlobalPointerMove);
            window.addEventListener('pointerup', handleGlobalPointerUp);
            // Optional: Change cursor style for the body while dragging
            // document.body.style.cursor = 'grabbing'; 
        } else {
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            // Optional: Reset cursor style
            // document.body.style.cursor = 'default';
        }

        return () => {
            // Cleanup: Remove listeners if component unmounts while dragging
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            // Optional: Reset cursor style
            // document.body.style.cursor = 'default';
        };
    }, [isDragging, handleGlobalPointerMove, handleGlobalPointerUp]);


    const materialProps = useControls({
        thickness: { value: 0.35, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.5, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1, step: 0.01 }, // Slightly increased default for visibility
        backside: { value: true},
        color: { value: '#9ef0f0' },
        distortion: { value: 0.2, min: 0, max: 1, step: 0.01 },
        distortionScale: { value: 0.5, min: 0, max: 1, step: 0.01 },
        temporalDistortion: { value: 0.0, min: 0, max: 1, step: 0.01 }, // Default to 0 (off)
        attenuationDistance: { value: 0.75, min: 0, max: 2, step: 0.01 }, // Default to 0.5, adjust as needed
        attenuationColor: { value: '#ffffff' } // Color light shifts to, often white or a light tint
    })
    
    return (
        <>
            {/* Transparent plane to capture clicks anywhere on the canvas background */}
            <mesh 
                onPointerDown={initiateDrag} 
                position={[0, 0, -1]} // Place slightly behind other content if necessary
            >
                <planeGeometry args={[viewport.width * 2, viewport.height * 2]} /> {/* Make it large enough */}
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>

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
                </Text>
                <mesh 
                    ref={torus} 
                    {...nodes.Torus002}
                    // onPointerDown is now on the background plane
                >
                    <MeshTransmissionMaterial {...materialProps} background={new Color('#9ef0f0')}/>
                </mesh>
            </group>
        </>
    )
}