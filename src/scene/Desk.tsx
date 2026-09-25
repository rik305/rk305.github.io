import { useEffect, useMemo } from 'react'
import { CanvasTexture, SRGBColorSpace } from 'three'

const LEFT_LINES = ['experience', 'projects', 'skills']
const RIGHT_LINES = ['resume.pdf', 'ready']

function useScreenTexture(lines: string[], accent: string) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 144
    const context = canvas.getContext('2d')
    if (!context) return null
    context.fillStyle = '#1a120c'
    context.fillRect(0, 0, 256, 144)
    context.fillStyle = accent
    context.fillRect(0, 0, 256, 18)
    context.fillStyle = '#f6efe4'
    context.font = '20px ui-monospace, monospace'
    lines.forEach((line, index) => {
      context.fillText(line, 16, 52 + index * 28)
    })
    const next = new CanvasTexture(canvas)
    next.colorSpace = SRGBColorSpace
    return next
  }, [accent, lines])

  useEffect(() => {
    return () => texture?.dispose()
  }, [texture])

  return texture
}

function Monitor({
  position,
  lines,
  accent,
  hot,
}: {
  position: [number, number, number]
  lines: string[]
  accent: string
  hot: boolean
}) {
  const texture = useScreenTexture(lines, accent)
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.35, 0.92, 0.12]} />
        <meshStandardMaterial color="#2a211c" emissive={hot ? '#e7b56a' : '#000000'} emissiveIntensity={hot ? 0.35 : 0} />
      </mesh>
      <mesh position={[0, 0.15, 0.07]}>
        <planeGeometry args={[1.16, 0.72]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? '#ffffff' : '#1a120c'}
          emissive="#ffb060"
          emissiveIntensity={hot ? 0.85 : 0.4}
        />
      </mesh>
      <mesh position={[0, -0.42, 0]} castShadow>
        <boxGeometry args={[0.16, 0.28, 0.16]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
      <mesh position={[0, -0.58, 0.05]}>
        <boxGeometry args={[0.46, 0.06, 0.28]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
    </group>
  )
}

export function Desk({ hot }: { hot: boolean }) {
  return (
    <group>
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.16, 1.7]} />
        <meshStandardMaterial color="#6b442c" emissive={hot ? '#e7b56a' : '#000000'} emissiveIntensity={hot ? 0.18 : 0} />
      </mesh>
      {[
        [-1.65, 0.5, -0.68],
        [1.65, 0.5, -0.68],
        [-1.65, 0.5, 0.68],
        [1.65, 0.5, 0.68],
      ].map((position) => (
        <mesh key={position.join(',')} position={position as [number, number, number]} castShadow>
          <boxGeometry args={[0.16, 1, 0.16]} />
          <meshStandardMaterial color="#4a2e22" />
        </mesh>
      ))}
      <Monitor position={[-0.78, 1.7, -0.35]} lines={LEFT_LINES} accent="#c4522a" hot={hot} />
      <Monitor position={[0.78, 1.7, -0.35]} lines={RIGHT_LINES} accent="#2f5d50" hot={hot} />
      <mesh position={[0, 1.14, 0.35]}>
        <boxGeometry args={[1.3, 0.05, 0.42]} />
        <meshStandardMaterial color="#2c211b" />
      </mesh>
      <mesh position={[1.35, 1.16, 0.42]}>
        <boxGeometry args={[0.28, 0.06, 0.36]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
    </group>
  )
}
