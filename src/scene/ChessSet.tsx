import { useMemo } from 'react'
import { VoxelBatch, type Voxel } from './voxels'

function pieces(rank: number, color: string, tall: boolean): Voxel[] {
  const list: Voxel[] = []
  for (let file = 0; file < 8; file++) {
    const king = tall && (file === 4)
    list.push({
      position: [(file - 3.5) * 0.2, 0.96 + (king ? 0.08 : 0), (rank - 3.5) * 0.2],
      color,
      scale: [0.7, king ? 1.5 : 1, 0.7],
    })
  }
  return list
}

export function ChessSet({ hot }: { hot: boolean }) {
  const squares = useMemo(() => {
    const cells: Voxel[] = []
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        cells.push({
          position: [(file - 3.5) * 0.2, 0.84, (rank - 3.5) * 0.2],
          color: (file + rank) % 2 === 0 ? '#f4efe4' : '#6b3e2a',
        })
      }
    }
    return cells
  }, [])
  const white = useMemo(() => [...pieces(0, '#f7f3ea', true), ...pieces(1, '#f7f3ea', false)], [])
  const black = useMemo(() => [...pieces(6, '#2a2420', false), ...pieces(7, '#2a2420', true)], [])

  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.8, 2.05]} />
        <meshStandardMaterial color="#6b442c" emissive={hot ? '#e7b56a' : '#000000'} emissiveIntensity={hot ? 0.2 : 0} />
      </mesh>
      <VoxelBatch voxels={squares} size={[0.18, 0.04, 0.18]} />
      <VoxelBatch voxels={white} size={[0.12, 0.16, 0.12]} />
      <VoxelBatch voxels={black} size={[0.12, 0.16, 0.12]} />
    </group>
  )
}
