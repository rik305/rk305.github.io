const NOTES = [
  { position: [0.06, 0.28, -0.38] as [number, number, number], color: '#f3e6c8', rotation: -0.08 },
  { position: [0.06, 0.22, 0.32] as [number, number, number], color: '#f6d7a8', rotation: 0.1 },
  { position: [0.06, -0.28, -0.05] as [number, number, number], color: '#f7f1e4', rotation: 0.02 },
]

export function Bulletin({ hot }: { hot: boolean }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.1, 1.35, 1.7]} />
        <meshStandardMaterial color={hot ? '#d7a15a' : '#a56b3c'} emissive={hot ? '#e7b56a' : '#000000'} emissiveIntensity={hot ? 0.25 : 0} />
      </mesh>
      <mesh position={[-0.04, 0, 0]}>
        <boxGeometry args={[0.06, 1.5, 1.86]} />
        <meshStandardMaterial color="#5c3a28" />
      </mesh>
      {NOTES.map((note) => (
        <mesh key={note.color} position={note.position} rotation={[0, note.rotation, 0]}>
          <boxGeometry args={[0.02, 0.38, 0.48]} />
          <meshStandardMaterial color={note.color} />
        </mesh>
      ))}
      <mesh position={[0.08, 0.55, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.08]} />
        <meshStandardMaterial color="#c4522a" />
      </mesh>
    </group>
  )
}
