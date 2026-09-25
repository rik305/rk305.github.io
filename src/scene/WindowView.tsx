export function WindowView({ night }: { night: boolean }) {
  return (
    <group position={[0.5, 2.5, -5.55]}>
      <mesh>
        <planeGeometry args={[4.4, 2.5]} />
        <meshBasicMaterial color={night ? '#152038' : '#f2c98a'} />
      </mesh>
      {night ? (
        <>
          <mesh position={[1.2, 0.55, 0.02]}>
            <boxGeometry args={[0.28, 0.28, 0.04]} />
            <meshBasicMaterial color="#f4f1e6" />
          </mesh>
          {[
            [-1.4, 0.7],
            [-0.6, 0.2],
            [0.2, 0.8],
            [1.5, -0.2],
            [-1.1, -0.5],
          ].map(([x, y]) => (
            <mesh key={`${x}-${y}`} position={[x ?? 0, y ?? 0, 0.03]}>
              <boxGeometry args={[0.08, 0.08, 0.02]} />
              <meshBasicMaterial color="#fff6d8" />
            </mesh>
          ))}
        </>
      ) : (
        <mesh position={[-1.3, 0.55, 0.02]}>
          <boxGeometry args={[0.42, 0.42, 0.04]} />
          <meshBasicMaterial color="#fff1c2" />
        </mesh>
      )}
    </group>
  )
}
