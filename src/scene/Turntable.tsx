import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useStore } from '../store/useStore'

export function Turntable({ hot }: { hot: boolean }) {
  const record = useRef<Group>(null)
  const playing = useStore((state) => state.playing)

  useFrame((_, delta) => {
    if (!playing || !record.current) return
    record.current.rotation.y += delta * 1.5
  })

  return (
    <group>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.45, 0.84, 1.25]} />
        <meshStandardMaterial color="#6b442c" emissive={hot ? '#e7b56a' : '#000000'} emissiveIntensity={hot ? 0.2 : 0} />
      </mesh>
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[1.15, 0.1, 1.05]} />
        <meshStandardMaterial color="#2a211c" />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 24]} />
        <meshStandardMaterial color="#1a120c" />
      </mesh>
      <group ref={record} position={[0, 1.02, 0]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 0.03, 28]} />
          <meshStandardMaterial color="#14110f" />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 20]} />
          <meshStandardMaterial color={playing ? '#c4522a' : '#d4a017'} emissive={playing ? '#e7b56a' : '#000000'} emissiveIntensity={playing ? 0.4 : 0} />
        </mesh>
      </group>
      <mesh position={[0.34, 1.08, 0.05]} rotation={[0.2, 0.4, -0.5]}>
        <boxGeometry args={[0.42, 0.04, 0.06]} />
        <meshStandardMaterial color="#c9c2b8" />
      </mesh>
    </group>
  )
}
