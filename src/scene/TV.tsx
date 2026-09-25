import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vec2 uv = vUv - 0.5;
    uv *= 1.0 + dot(uv, uv) * 0.28;
    uv += 0.5;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    float scan = sin((uv.y + uTime * 0.04) * 240.0) * 0.08;
    float bar = smoothstep(0.45, 0.55, fract(uv.x * 2.0 - uTime * 0.15));
    vec3 phosphor = vec3(0.12, 0.42, 0.24);
    vec3 col = phosphor * (0.78 + scan) + vec3(0.04, 0.12, 0.05) * bar;
    float vignette = smoothstep(0.85, 0.25, length(vUv - 0.5));
    float flicker = 0.93 + 0.07 * sin(uTime * 17.0);
    gl_FragColor = vec4(col * vignette * flicker, 1.0);
  }
`

export function TV({ hot }: { hot: boolean }) {
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.5, 0.16, 0.7]} />
        <meshStandardMaterial color="#3a2a22" />
      </mesh>
      <mesh position={[-0.55, 0.16, 0.2]}>
        <boxGeometry args={[0.12, 0.32, 0.12]} />
        <meshStandardMaterial color="#2a1c16" />
      </mesh>
      <mesh position={[0.55, 0.16, 0.2]}>
        <boxGeometry args={[0.12, 0.32, 0.12]} />
        <meshStandardMaterial color="#2a1c16" />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[1.7, 1.2, 0.55]} />
        <meshStandardMaterial color="#2c211b" emissive={hot ? '#7dcea0' : '#000000'} emissiveIntensity={hot ? 0.28 : 0} />
      </mesh>
      <mesh position={[0, 1.28, 0.29]}>
        <planeGeometry args={[1.28, 0.86]} />
        <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
      </mesh>
      <mesh position={[-0.28, 1.98, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.06, 0.42, 0.06]} />
        <meshStandardMaterial color="#c9c2b8" />
      </mesh>
      <mesh position={[0.28, 1.98, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.06, 0.42, 0.06]} />
        <meshStandardMaterial color="#c9c2b8" />
      </mesh>
    </group>
  )
}
