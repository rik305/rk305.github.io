import { create } from 'zustand'

export type ModalId = 'computer' | 'tv' | 'turntable' | 'bookshelf' | 'contact'
export type CameraFocus = 'room' | 'desk'

type State = {
  modal: ModalId | null
  hovered: string | null
  playing: boolean
  cameraFocus: CameraFocus
  loaderActive: boolean
  loaderProgress: number
  open: (modal: ModalId) => void
  close: () => void
  setHovered: (id: string | null) => void
  setPlaying: (playing: boolean) => void
  setLoader: (active: boolean, progress: number) => void
}

export const useStore = create<State>((set) => ({
  modal: null,
  hovered: null,
  playing: false,
  cameraFocus: 'room',
  loaderActive: false,
  loaderProgress: 0,
  open: (modal) =>
    set({
      modal,
      hovered: null,
      cameraFocus: modal === 'computer' ? 'desk' : 'room',
    }),
  close: () => set({ modal: null, cameraFocus: 'room' }),
  setHovered: (hovered) => set({ hovered }),
  setPlaying: (playing) => set({ playing }),
  setLoader: (loaderActive, loaderProgress) =>
    set((state) =>
      state.loaderActive === loaderActive && state.loaderProgress === loaderProgress
        ? state
        : { loaderActive, loaderProgress },
    ),
}))
