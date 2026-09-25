import { OrthographicCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { memo, useLayoutEffect, useRef } from 'react'
import { MathUtils, OrthographicCamera as ThreeOrtho, Vector3 } from 'three'
import { useIsMobile } from '../hooks/useIsMobile'
import { useStore } from '../store/useStore'

const ROOM_POS = new Vector3(16, 12.5, 16)
const ROOM_LOOK = new Vector3(0.2, 1.8, -0.4)
const DESK_POS = new Vector3(6.2, 6.4, 8.4)
const DESK_LOOK = new Vector3(-1.2, 2.15, 0.15)
const ROOM_ZOOM = 50
const DESK_ZOOM = 96
const MOBILE_ROOM_ZOOM = 26
const MOBILE_DESK_ZOOM = 52

export const IsoCamera = memo(function IsoCamera() {
  return (
    <OrthographicCamera makeDefault position={[16, 12.5, 16]} zoom={ROOM_ZOOM} near={-40} far={80} />
  )
})

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const focus = useStore((state) => state.cameraFocus)
  const mobile = useIsMobile()
  const roomZoom = mobile ? MOBILE_ROOM_ZOOM : ROOM_ZOOM
  const deskZoom = mobile ? MOBILE_DESK_ZOOM : DESK_ZOOM
  const look = useRef(ROOM_LOOK.clone())
  const desired = useRef(new Vector3())

  useLayoutEffect(() => {
    camera.position.copy(ROOM_POS)
    camera.lookAt(ROOM_LOOK)
    if (camera instanceof ThreeOrtho) {
      camera.zoom = roomZoom
      camera.updateProjectionMatrix()
    }
  }, [camera, roomZoom])

  useFrame((_, delta) => {
    if (!(camera instanceof ThreeOrtho)) return
    const desk = focus === 'desk'
    desired.current.copy(desk ? DESK_POS : ROOM_POS)
    const alpha = 1 - Math.exp(-delta * 2.8)
    camera.position.lerp(desired.current, alpha)
    look.current.lerp(desk ? DESK_LOOK : ROOM_LOOK, alpha)
    camera.lookAt(look.current)
    camera.zoom = MathUtils.damp(camera.zoom, desk ? deskZoom : roomZoom, 2.8, delta)
    camera.updateProjectionMatrix()
  })

  return null
}
