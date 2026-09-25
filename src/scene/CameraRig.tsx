import { OrthographicCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { memo, useEffect, useRef } from 'react'
import { MathUtils, OrthographicCamera as ThreeOrtho, Vector3 } from 'three'
import { useIsMobile } from '../hooks/useIsMobile'
import { useStore } from '../store/useStore'

const ROOM_TARGET = new Vector3(0, 1.55, 0)
const DESK_TARGET = new Vector3(0, 1.9, 0.15)
const ROOM_AZIMUTH = Math.PI / 4
const DESK_AZIMUTH = Math.PI / 4
const POLAR = 0.96
const RADIUS = 24
const ROOM_ZOOM = 48
const DESK_ZOOM = 92
const MOBILE_ROOM_ZOOM = 24
const MOBILE_DESK_ZOOM = 48

export const IsoCamera = memo(function IsoCamera() {
  return (
    <OrthographicCamera makeDefault position={[16, 12.5, 16]} zoom={ROOM_ZOOM} near={-40} far={90} />
  )
})

export function CameraRig() {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const focus = useStore((state) => state.cameraFocus)
  const setDragging = useStore((state) => state.setDragging)
  const mobile = useIsMobile()
  const roomZoom = mobile ? MOBILE_ROOM_ZOOM : ROOM_ZOOM
  const deskZoom = mobile ? MOBILE_DESK_ZOOM : DESK_ZOOM

  const azimuth = useRef(ROOM_AZIMUTH)
  const polar = useRef(POLAR)
  const zoom = useRef(roomZoom)
  const target = useRef(ROOM_TARGET.clone())
  const steer = useRef(false)
  const focusRef = useRef(focus)
  const drag = useRef(0)
  const held = useRef(false)
  const dragging = useRef(false)
  const velAzimuth = useRef(0)
  const velPolar = useRef(0)
  const velZoom = useRef(0)
  const appliedZoom = useRef(-1)

  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
  }, [gl])

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'none'
    const pointers = new Map<number, { x: number; y: number }>()
    let pinch = 0

    const down = (event: PointerEvent) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
      drag.current = 0
      held.current = true
      velAzimuth.current = 0
      velPolar.current = 0
    }

    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId)
      if (!previous) return
      const dx = event.clientX - previous.x
      const dy = event.clientY - previous.y
      previous.x = event.clientX
      previous.y = event.clientY

      if (pointers.size >= 2) {
        const points = [...pointers.values()]
        const first = points[0]
        const second = points[1]
        if (!first || !second) return
        const distance = Math.hypot(first.x - second.x, first.y - second.y)
        if (pinch > 0) {
          velZoom.current += Math.log(distance / pinch)
          steer.current = true
        }
        pinch = distance
        return
      }

      if (dx === 0 && dy === 0) return
      drag.current += Math.hypot(dx, dy)
      if (drag.current > 6 && !dragging.current) {
        dragging.current = true
        setDragging(true)
        document.body.style.cursor = 'grabbing'
      }
      velAzimuth.current = -dx * 0.005
      velPolar.current = dy * 0.003
      azimuth.current += velAzimuth.current
      polar.current = MathUtils.clamp(polar.current + velPolar.current, 0.55, 1.25)
      steer.current = true
    }

    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId)
      if (pointers.size < 2) pinch = 0
      if (pointers.size === 0) {
        held.current = false
        drag.current = 0
        if (document.body.style.cursor === 'grabbing') document.body.style.cursor = 'auto'
        if (dragging.current) {
          dragging.current = false
          requestAnimationFrame(() => setDragging(false))
        }
      }
    }

    const wheel = (event: WheelEvent) => {
      event.preventDefault()
      velZoom.current += -event.deltaY * 0.0011
      steer.current = true
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [gl, setDragging])

  useFrame((state, delta) => {
    if (!(camera instanceof ThreeOrtho)) return
    if (focusRef.current !== focus) {
      focusRef.current = focus
      steer.current = false
      velAzimuth.current = 0
      velPolar.current = 0
      velZoom.current = 0
    }

    const moving = held.current || Math.abs(velAzimuth.current) > 0.00005 || Math.abs(velPolar.current) > 0.00005 || Math.abs(velZoom.current) > 0.00005
    if (moving) state.performance.regress()

    if (!held.current && steer.current) {
      const decay = Math.exp(-delta * 7)
      azimuth.current += velAzimuth.current
      polar.current = MathUtils.clamp(polar.current + velPolar.current, 0.55, 1.25)
      velAzimuth.current *= decay
      velPolar.current *= decay
      if (Math.abs(velAzimuth.current) < 0.00005) velAzimuth.current = 0
      if (Math.abs(velPolar.current) < 0.00005) velPolar.current = 0
    }

    if (Math.abs(velZoom.current) > 0.00005) {
      zoom.current = MathUtils.clamp(zoom.current * Math.exp(velZoom.current), 16, 140)
      velZoom.current *= Math.exp(-delta * 10)
      if (Math.abs(velZoom.current) < 0.00005) velZoom.current = 0
    }

    const desk = focus === 'desk'
    const goalZoom = desk ? deskZoom : roomZoom
    const goalTarget = desk ? DESK_TARGET : ROOM_TARGET
    let focusing = false
    if (!steer.current) {
      focusing = true
      azimuth.current = MathUtils.damp(azimuth.current, desk ? DESK_AZIMUTH : ROOM_AZIMUTH, 2.8, delta)
      polar.current = MathUtils.damp(polar.current, POLAR, 2.8, delta)
      zoom.current = MathUtils.damp(zoom.current, goalZoom, 2.8, delta)
      target.current.lerp(goalTarget, 1 - Math.exp(-delta * 2.8))
      const settled =
        Math.abs(azimuth.current - (desk ? DESK_AZIMUTH : ROOM_AZIMUTH)) < 0.001 &&
        Math.abs(zoom.current - goalZoom) < 0.05 &&
        target.current.distanceToSquared(goalTarget) < 0.0004
      if (settled) focusing = false
    }

    if (!moving && !focusing && Math.abs(camera.zoom - zoom.current) < 0.01) return

    const sinPolar = Math.sin(polar.current)
    camera.position.set(
      target.current.x + RADIUS * sinPolar * Math.sin(azimuth.current),
      target.current.y + RADIUS * Math.cos(polar.current),
      target.current.z + RADIUS * sinPolar * Math.cos(azimuth.current),
    )
    camera.lookAt(target.current)
    if (Math.abs(appliedZoom.current - zoom.current) > 0.01) {
      appliedZoom.current = zoom.current
      camera.zoom = zoom.current
      camera.updateProjectionMatrix()
    }
  })

  return null
}
