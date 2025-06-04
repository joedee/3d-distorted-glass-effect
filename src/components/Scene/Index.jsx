'use client';
import { Canvas } from '@react-three/fiber'
import Model from './Model';
import { Environment } from '@react-three/drei';
import { useControls } from 'leva';

export default function Index() {
  const { ambientIntensity, ambientColor } = useControls('Ambient Light', {
    ambientIntensity: { value: 0.5, min: 0, max: 2, step: 0.01, label: 'Intensity' },
    ambientColor: { value: '#ffffff', label: 'Color' },
  });

  const { dirIntensity, dirColor, dirPosition } = useControls('Directional Light', {
    dirIntensity: { value: 3.5, min: 0, max: 10, step: 0.1, label: 'Intensity' },
    dirColor: { value: '#ffffff', label: 'Color' },
    dirPosition: { value: [0, 2, 3], step: 0.1, label: 'Position (X,Y,Z)' },
  });

  return (
    <Canvas style={{background: '#9ef0f0'}}>
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <Model />
        <directionalLight intensity={dirIntensity} color={dirColor} position={dirPosition} />
        <Environment preset="apartment" />
    </Canvas>
  )
}