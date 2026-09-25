import { useLayoutEffect, useRef } from 'react'
import { Color, Object3D, type InstancedMesh } from 'three'

export type Voxel = {
  position: [number, number, number]
  color: string
  scale?: [number, number, number]
}

const WOOD = ['#8d5a34', '#7b4b2a', '#a0673d', '#6a4124']
const PLASTER = ['#ead7b5', '#e2cba4', '#f3e2c6', '#d8c09a']
const TRIM = '#5c3a2a'
const GREENS = ['#3f6b45', '#2f5d3a', '#6a8f4e', '#234833']

const dummy = new Object3D()
const scratch = new Color()

export function buildShell() {
  const floor: Voxel[] = []
  const walls: Voxel[] = []
  const rug: Voxel[] = []
  const leaves: Voxel[] = []
  const plant: Voxel[] = []

  for (let x = -7; x <= 6; x++) {
    for (let z = -6; z <= 5; z++) {
      floor.push({
        position: [x + 0.5, -0.5, z + 0.5],
        color: WOOD[Math.abs(x + z) % WOOD.length] ?? WOOD[0],
      })
    }
  }

  for (let x = -7; x <= 6; x++) {
    for (let y = 0; y <= 5; y++) {
      const inWindow = x >= -2 && x <= 2 && y >= 1 && y <= 3
      if (inWindow) continue
      walls.push({
        position: [x + 0.5, y + 0.5, -5.5],
        color: y === 0 ? TRIM : (PLASTER[Math.abs(x + y) % PLASTER.length] ?? PLASTER[0]),
      })
    }
  }

  for (let z = -5; z <= 5; z++) {
    for (let y = 0; y <= 5; y++) {
      walls.push({
        position: [-6.5, y + 0.5, z + 0.5],
        color: y === 0 ? TRIM : (PLASTER[Math.abs(z + y) % PLASTER.length] ?? PLASTER[0]),
      })
    }
  }

  for (let x = -2; x <= 3; x++) {
    for (let z = -1; z <= 2; z++) {
      rug.push({
        position: [x + 0.5, 0.045, z + 0.5],
        color: (x + z) % 2 === 0 ? '#8c3a32' : '#c47a45',
      })
    }
  }

  const leafColors = ['#c4522a', '#d4762c', '#e0a04a', '#8f3d28', '#b85a30']
  const spots: [number, number][] = [
    [-1.2, -3.2],
    [0.2, -3.6],
    [1.1, -2.7],
    [-2.1, -2.9],
    [1.8, -3.9],
  ]
  spots.forEach(([x, z], index) => {
    leaves.push({
      position: [x, 0.06, z],
      color: leafColors[index] ?? leafColors[0],
    })
  })

  const pot: [number, number, number][] = [
    [-4.5, 0.25, -4.2],
    [-4.5, 0.7, -4.2],
  ]
  pot.forEach((position) => plant.push({ position, color: '#6b3e2a' }))
  const foliage: [number, number, number][] = [
    [-4.5, 1.2, -4.2],
    [-4.9, 1.45, -4.2],
    [-4.1, 1.45, -4.0],
    [-4.5, 1.7, -4.4],
    [-4.5, 1.85, -4.15],
  ]
  foliage.forEach((position, index) => {
    plant.push({ position, color: GREENS[index % GREENS.length] ?? GREENS[0] })
  })

  return { floor, walls, rug, leaves, plant }
}

const SPINES = ['#c4522a', '#2f5d50', '#d4a017', '#6b3e2a', '#3d4f7c', '#8c3a4b', '#c47b4a', '#245c4a']

export function buildBooks() {
  const books: Voxel[] = []
  const shelfYs = [0.55, 1.45, 2.35]
  shelfYs.forEach((y, shelf) => {
    let cursor = -1.15
    for (let index = 0; index < 8; index++) {
      const width = index % 3 === 0 ? 0.22 : 0.16
      const height = 0.62 + ((index + shelf) % 3) * 0.08
      books.push({
        position: [cursor, y + height / 2 - 0.28, 0.02],
        color: SPINES[(index + shelf * 3) % SPINES.length] ?? SPINES[0],
        scale: [width / 0.18, height / 0.7, 0.85],
      })
      cursor += width + 0.04
    }
  })
  return books
}

type BatchProps = {
  voxels: Voxel[]
  size?: [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
}

export function VoxelBatch({
  voxels,
  size = [0.96, 0.96, 0.96],
  castShadow = false,
  receiveShadow = false,
}: BatchProps) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    voxels.forEach((voxel, index) => {
      const scale = voxel.scale ?? [1, 1, 1]
      dummy.position.set(voxel.position[0], voxel.position[1], voxel.position[2])
      dummy.scale.set(scale[0], scale[1], scale[2])
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, scratch.set(voxel.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [voxels])

  if (voxels.length === 0) return null

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, voxels.length]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <boxGeometry args={size} />
      <meshLambertMaterial />
    </instancedMesh>
  )
}
