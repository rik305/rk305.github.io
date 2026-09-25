import { useMemo } from 'react'
import { buildBooks, VoxelBatch } from './voxels'

export function Bookshelf({ hot }: { hot: boolean }) {
  const books = useMemo(() => buildBooks(), [])
  const wood = hot ? '#e7b56a' : '#5c3a28'
  return (
    <group>
      <mesh position={[-1.35, 1.45, 0]} castShadow>
        <boxGeometry args={[0.14, 2.9, 0.7]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      <mesh position={[1.35, 1.45, 0]} castShadow>
        <boxGeometry args={[0.14, 2.9, 0.7]} />
        <meshStandardMaterial color={wood} />
      </mesh>
      <mesh position={[0, 1.45, -0.28]}>
        <boxGeometry args={[2.55, 2.9, 0.08]} />
        <meshStandardMaterial color="#4a3024" />
      </mesh>
      {[0.2, 1.15, 2.1, 2.9].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[2.55, 0.1, 0.68]} />
          <meshStandardMaterial color="#6b442c" />
        </mesh>
      ))}
      <VoxelBatch voxels={books} size={[0.18, 0.7, 0.42]} />
    </group>
  )
}
