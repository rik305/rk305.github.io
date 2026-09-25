import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import { Bookshelf } from './Bookshelf'
import { Bulletin } from './Bulletin'
import { Desk } from './Desk'
import { Interactable } from './Interactable'
import { Turntable } from './Turntable'
import { TV } from './TV'
import { buildShell, VoxelBatch } from './voxels'

export function Room({ shadows }: { shadows: boolean }) {
  const shell = useMemo(() => buildShell(), [])
  const open = useStore((state) => state.open)

  return (
    <group>
      <ambientLight intensity={0.42} color="#ffd8b0" />
      <directionalLight
        position={[10, 16, 8]}
        intensity={1.85}
        color="#ffd2a1"
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-bias={-0.001}
      />
      <pointLight position={[0.4, 3.2, -4.2]} intensity={1.4} color="#ffc48a" distance={10} />
      <pointLight position={[-4.6, 2.4, 2.2]} intensity={0.7} color="#ffb067" distance={7} />

      <mesh position={[0, -1.05, -0.2]} receiveShadow>
        <boxGeometry args={[15.4, 0.3, 13.4]} />
        <meshLambertMaterial color="#4a2e22" />
      </mesh>

      <VoxelBatch voxels={shell.floor} receiveShadow={shadows} />
      <VoxelBatch voxels={shell.walls} castShadow={shadows} receiveShadow={shadows} />
      <VoxelBatch voxels={shell.rug} size={[0.96, 0.06, 0.96]} receiveShadow={shadows} />
      <VoxelBatch voxels={shell.leaves} size={[0.42, 0.08, 0.32]} />
      <VoxelBatch voxels={shell.plant} size={[0.42, 0.42, 0.42]} castShadow={shadows} />

      <mesh position={[0.5, 2.5, -5.32]}>
        <boxGeometry args={[4.7, 2.7, 0.06]} />
        <meshStandardMaterial color="#b7d7e2" transparent opacity={0.45} emissive="#ffd2a1" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0.5, 2.5, -5.2]}>
        <boxGeometry args={[0.1, 2.85, 0.1]} />
        <meshStandardMaterial color="#5c3a28" />
      </mesh>
      <mesh position={[0.5, 2.5, -5.2]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 4.9, 0.1]} />
        <meshStandardMaterial color="#5c3a28" />
      </mesh>

      <group position={[-4.7, 0, 2.4]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.12, 1.1, 0.12]} />
          <meshStandardMaterial color="#3a2a22" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.46, 0.28, 0.46]} />
          <meshStandardMaterial color="#e7b56a" emissive="#ffb067" emissiveIntensity={0.7} />
        </mesh>
      </group>

      <Interactable
        id="computer"
        label="Computer"
        position={[0, 0, 0.6]}
        rotation={[0, Math.PI / 4, 0]}
        tooltip={[0, 3.1, 0]}
        onSelect={() => open('computer')}
      >
        {(hot) => <Desk hot={hot} />}
      </Interactable>
      <Interactable
        id="tv"
        label="Television"
        position={[3.6, 0, 2.2]}
        rotation={[0, Math.PI / 4, 0]}
        tooltip={[0, 2.6, 0]}
        onSelect={() => open('tv')}
      >
        {(hot) => <TV hot={hot} />}
      </Interactable>
      <Interactable
        id="turntable"
        label="Turntable"
        position={[2.2, 0, -1.2]}
        rotation={[0, Math.PI / 4, 0]}
        tooltip={[0, 1.8, 0]}
        onSelect={() => open('turntable')}
      >
        {(hot) => <Turntable hot={hot} />}
      </Interactable>
      <Interactable
        id="bookshelf"
        label="Bookshelf"
        position={[2.4, 0, -3.4]}
        rotation={[0, Math.PI / 4, 0]}
        tooltip={[0, 3.3, 0]}
        onSelect={() => open('bookshelf')}
      >
        {(hot) => <Bookshelf hot={hot} />}
      </Interactable>
      <Interactable
        id="contact"
        label="Contact"
        position={[-3.2, 1.15, -1.6]}
        rotation={[0, -Math.PI / 4, 0]}
        tooltip={[0.9, 1.1, 0]}
        onSelect={() => open('contact')}
      >
        {(hot) => <Bulletin hot={hot} />}
      </Interactable>
    </group>
  )
}
