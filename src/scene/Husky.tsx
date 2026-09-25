import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Color, Object3D, Plane, Vector3, type InstancedMesh } from 'three'
import { useStore } from '../store/useStore'

const BLACK = '#1c1c1c'
const PINK = '#f2a8c4'
const WHITE = '#f6f3ee'
const CREAM = '#e4ddd2'
const GRAY = '#b7b7b7'
const MID = '#8d8d8d'

type Cell = { x: number; y: number; z: number; color: string }

const ROOM_X = [-5.6, 6.1] as const
const ROOM_Z = [-4.6, 5.1] as const

function paint(cells: Map<string, Cell>, x: number, y: number, z: number, color: string) {
  cells.set(`${x},${y},${z}`, { x, y, z, color })
}

function ellipsoid(
  cells: Map<string, Cell>,
  cx: number,
  cy: number,
  cz: number,
  rx: number,
  ry: number,
  rz: number,
  color: string,
) {
  const x0 = Math.floor(cx - rx)
  const x1 = Math.ceil(cx + rx)
  const y0 = Math.max(0, Math.floor(cy - ry))
  const y1 = Math.ceil(cy + ry)
  const z0 = Math.floor(cz - rz)
  const z1 = Math.ceil(cz + rz)
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      for (let z = z0; z <= z1; z++) {
        const nx = (x - cx) / rx
        const ny = (y - cy) / ry
        const nz = (z - cz) / rz
        if (nx * nx + ny * ny + nz * nz <= 1) paint(cells, x, y, z, color)
      }
    }
  }
}

function sittingHusky(): { body: Cell[]; tail: Cell[] } {
  const body = new Map<string, Cell>()
  const tail = new Map<string, Cell>()
  ellipsoid(body, -2, 6, 0, 6, 4.6, 4.2, GRAY)
  ellipsoid(body, -0.6, 3.2, 0, 4.4, 2.2, 3.2, CREAM)
  ellipsoid(body, 3.2, 8.4, 0, 4, 4.8, 3.8, WHITE)
  ellipsoid(body, -1, 10, 0, 4.8, 2, 3, BLACK)
  ellipsoid(body, 4.2, 3.4, -2.8, 1.5, 3.2, 1.3, WHITE)
  ellipsoid(body, 4.2, 3.4, 2.8, 1.5, 3.2, 1.3, GRAY)
  ellipsoid(body, 4.2, 1.1, -2.8, 1.7, 1.1, 1.4, MID)
  ellipsoid(body, 4.2, 1.1, 2.8, 1.7, 1.1, 1.4, MID)
  ellipsoid(body, 8.2, 14.6, 0, 4.4, 3.8, 3.8, WHITE)
  ellipsoid(body, 9.4, 14.2, -2.1, 2.1, 1.3, 1.5, BLACK)
  ellipsoid(body, 9.4, 14.2, 2.1, 2.1, 1.3, 1.5, BLACK)
  ellipsoid(body, 8.6, 16.2, 0, 1.2, 1.6, 1.1, WHITE)
  for (let y = 13; y <= 15; y++) {
    paint(body, 11, y, -2, WHITE)
    paint(body, 11, y, 2, WHITE)
    paint(body, 12, y, -3, BLACK)
    paint(body, 12, y, 3, BLACK)
  }
  paint(body, 12, 14, -2, BLACK)
  paint(body, 12, 14, 2, BLACK)
  paint(body, 12, 15, -2, WHITE)
  paint(body, 12, 15, 2, WHITE)
  ellipsoid(body, 10.2, 16.4, -1.7, 1.15, 0.7, 1.05, BLACK)
  ellipsoid(body, 10.2, 16.4, 1.7, 1.15, 0.7, 1.05, BLACK)
  paint(body, 11, 17, -2, WHITE)
  paint(body, 11, 17, 2, WHITE)
  ellipsoid(body, 11.6, 14.6, 0, 1.2, 0.8, 1.15, BLACK)
  ellipsoid(body, 12.8, 14, 0, 0.75, 0.5, 0.65, BLACK)
  for (let z = -1; z <= 1; z++) paint(body, 11, 13, z, BLACK)
  ellipsoid(body, 6.8, 20.2, -2.4, 1.4, 2.8, 1.2, BLACK)
  ellipsoid(body, 6.8, 20.2, 2.4, 1.4, 2.8, 1.2, BLACK)
  ellipsoid(body, 7, 19.8, -2, 0.6, 1.6, 0.55, PINK)
  ellipsoid(body, 7, 19.8, 2, 0.6, 1.6, 0.55, PINK)
  ellipsoid(tail, -8, 6.4, 0, 2.6, 2, 2, GRAY)
  ellipsoid(tail, -10.6, 5.2, 0.4, 2.2, 1.7, 1.7, MID)
  ellipsoid(tail, -12.8, 4.2, 0.6, 2, 1.4, 1.4, BLACK)
  return { body: [...body.values()], tail: [...tail.values()] }
}

function curledHusky(): Cell[] {
  const cells = new Map<string, Cell>()
  ellipsoid(cells, 0, 3.2, 0, 4.6, 2.2, 4.2, GRAY)
  ellipsoid(cells, 0.6, 4.8, 0, 3.8, 1.3, 3.2, BLACK)
  ellipsoid(cells, -3.4, 3.4, 0.6, 2.2, 1.4, 1.5, MID)
  ellipsoid(cells, -5.2, 2.8, 0.8, 1.6, 1.1, 1.2, BLACK)
  ellipsoid(cells, 3.6, 4.2, 0, 2.2, 1.8, 2, WHITE)
  ellipsoid(cells, 5.2, 5.4, 0, 1.3, 0.8, 1.1, BLACK)
  ellipsoid(cells, 4.6, 7.2, -1.3, 0.7, 1.5, 0.6, BLACK)
  ellipsoid(cells, 4.6, 7.2, 1.3, 0.7, 1.5, 0.6, BLACK)
  ellipsoid(cells, 4.7, 7, -1.1, 0.3, 0.8, 0.3, PINK)
  ellipsoid(cells, 4.7, 7, 1.1, 0.3, 0.8, 0.3, PINK)
  return [...cells.values()]
}

const dummy = new Object3D()
const scratch = new Color()
const floor = new Plane(new Vector3(0, 1, 0), 0)
const hit = new Vector3()

function insideRoom(x: number, z: number) {
  return x >= ROOM_X[0] && x <= ROOM_X[1] && z >= ROOM_Z[0] && z <= ROOM_Z[1]
}

function clampRoom(x: number, z: number) {
  return [Math.min(ROOM_X[1], Math.max(ROOM_X[0], x)), Math.min(ROOM_Z[1], Math.max(ROOM_Z[0], z))] as const
}

function VoxelDog({ cells, size }: { cells: Cell[]; size: number }) {
  const ref = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    cells.forEach((cell, index) => {
      dummy.position.set(cell.x * size, cell.y * size, cell.z * size)
      dummy.scale.set(1, 1, 1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(index, dummy.matrix)
      mesh.setColorAt(index, scratch.set(cell.color))
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [cells, size])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cells.length]}>
      <boxGeometry args={[size * 0.92, size * 0.92, size * 0.92]} />
      <meshLambertMaterial />
    </instancedMesh>
  )
}

export function Husky({ night }: { night: boolean }) {
  const group = useRef<Object3D>(null)
  const tail = useRef<Object3D>(null)
  const model = useMemo(() => sittingHusky(), [])
  const curled = useMemo(() => curledHusky(), [])
  const place = useRef(new Vector3(1.2, 0, 3.4))
  const goal = useRef(new Vector3(1.2, 0, 3.4))
  const following = useRef(true)
  const curledUp = useRef(night)
  const [, redraw] = useState(0)
  const dragging = useStore((state) => state.dragging)
  const modal = useStore((state) => state.modal)
  const size = 0.085

  const setCurled = (next: boolean) => {
    if (curledUp.current === next) return
    curledUp.current = next
    redraw((value) => value + 1)
  }

  const sitAt = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (night || useStore.getState().dragging || useStore.getState().modal) return
    const [x, z] = clampRoom(event.point.x, event.point.z)
    following.current = false
    goal.current.set(x, 0, z)
  }

  const resume = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (night || useStore.getState().dragging) return
    following.current = true
  }

  useFrame((state, delta) => {
    const dog = group.current
    if (!dog) return
    if (following.current && !night && !dragging && !modal) {
      state.raycaster.setFromCamera(state.pointer, state.camera)
      if (state.raycaster.ray.intersectPlane(floor, hit) && insideRoom(hit.x, hit.z)) {
        goal.current.set(hit.x, 0, hit.z)
      }
    }
    const dx = goal.current.x - place.current.x
    const dz = goal.current.z - place.current.z
    const distance = Math.hypot(dx, dz)
    const walking = !night && distance > 0.05
    if (walking) {
      const step = Math.min(distance, delta * 2.1)
      place.current.x += (dx / distance) * step
      place.current.z += (dz / distance) * step
      const face = Math.atan2(-dz, dx)
      dog.rotation.y += Math.atan2(Math.sin(face - dog.rotation.y), Math.cos(face - dog.rotation.y)) * Math.min(1, delta * 8)
    }
    dog.position.copy(place.current)
    if (tail.current) {
      tail.current.rotation.z = walking ? Math.sin(state.clock.elapsedTime * 7) * 0.18 : 0
    }
    setCurled(night || (!following.current && !walking))
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.1, 0.2]} onPointerUp={sitAt}>
        <planeGeometry args={[13.6, 11.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={group} position={[1.2, 0, 3.4]} rotation={[0, Math.PI / 4, 0]} onPointerUp={resume}>
        {curledUp.current ? (
          <VoxelDog cells={curled} size={size} />
        ) : (
          <>
            <VoxelDog cells={model.body} size={size} />
            <group ref={tail}>
              <VoxelDog cells={model.tail} size={size} />
            </group>
          </>
        )}
      </group>
    </group>
  )
}
