import { Html } from '@react-three/drei'
import type { ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../store/useStore'

type InteractableProps = {
  id: string
  label: string
  position: [number, number, number]
  tooltip?: [number, number, number]
  onSelect: () => void
  children: (hot: boolean) => ReactNode
}

export function Interactable({
  id,
  label,
  position,
  tooltip = [0, 2.3, 0],
  onSelect,
  children,
}: InteractableProps) {
  const hot = useStore((state) => state.hovered === id)
  const setHovered = useStore((state) => state.setHovered)

  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (event.pointerType === 'touch') return
    setHovered(id)
    document.body.style.cursor = 'pointer'
  }

  const out = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (useStore.getState().hovered === id) setHovered(null)
    document.body.style.cursor = 'auto'
  }

  const up = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group position={position} onPointerOver={over} onPointerOut={out} onPointerUp={up}>
      {children(hot)}
      {hot ? (
        <Html position={tooltip} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded border border-[#e7b56a] bg-[#2a1a12]/95 px-2 py-1 text-xs text-[#f6efe4]">
            {label}
          </div>
        </Html>
      ) : null}
    </group>
  )
}
