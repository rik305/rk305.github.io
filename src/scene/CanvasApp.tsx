import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useStore } from '../store/useStore'
import { CameraRig, IsoCamera } from './CameraRig'
import { Room } from './Room'

function ProgressSync() {
  const active = useProgress((state) => state.active)
  const progress = useProgress((state) => state.progress)
  const setLoader = useStore((state) => state.setLoader)

  useEffect(() => {
    setLoader(active, progress)
  }, [active, progress, setLoader])

  return null
}

export default function CanvasApp() {
  const mobile = useIsMobile()

  return (
    <Canvas
      className="h-full w-full"
      aria-label="Isometric autumn room. Use the room controls to open the computer, television, turntable, bookshelf, and contact board."
      dpr={mobile ? [1, 1.5] : [1, 2]}
      performance={{ min: 0.5, debounce: 250 }}
      resize={{ debounce: 200 }}
      gl={{ antialias: !mobile, powerPreference: 'high-performance', alpha: false, stencil: false, depth: true }}
      shadows={!mobile}
      onPointerMissed={() => useStore.getState().setHovered(null)}
    >
      <color attach="background" args={['#3a241c']} />
      <IsoCamera />
      <CameraRig />
      <ProgressSync />
      <Room shadows={!mobile} />
      {mobile ? null : (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom luminanceThreshold={0.85} intensity={0.28} mipmapBlur={false} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
