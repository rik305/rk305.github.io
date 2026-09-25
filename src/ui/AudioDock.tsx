import { Pause, Play } from 'lucide-react'
import { setAmbientPlaying } from '../audio/ambient'
import { useStore } from '../store/useStore'
import { ModalShell } from './ModalShell'

export function AudioDock() {
  const playing = useStore((state) => state.playing)
  const setPlaying = useStore((state) => state.setPlaying)

  const toggle = () => {
    const next = !useStore.getState().playing
    setPlaying(next)
    void setAmbientPlaying(next)
  }

  return (
    <ModalShell title="Turntable">
      <div className="flex items-center justify-between gap-4 border border-[#5c3a28] bg-[#2a1a12] p-4 text-[#f6efe4]">
        <div>
          <p className="text-lg">Ambient pad</p>
          <p className="text-sm text-[#e7b56a]">{playing ? 'Spinning' : 'Paused'}</p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-2 bg-[#c4522a] px-4 py-2"
          aria-pressed={playing}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
    </ModalShell>
  )
}
