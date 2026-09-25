import { lazy, Suspense, useEffect } from 'react'
import { disposeAmbient } from './audio/ambient'
import { site } from './content/site'
import { useStore } from './store/useStore'
import { A11yNav } from './ui/A11yNav'
import { Overlays } from './ui/Overlays'
import { Seo } from './ui/Seo'
import { VoxelLoader } from './ui/VoxelLoader'

const CanvasApp = lazy(() => import('./scene/CanvasApp'))

function AssetLoader() {
  const active = useStore((state) => state.loaderActive)
  const progress = useStore((state) => state.loaderProgress)
  if (!active) return null
  return <VoxelLoader progress={progress} />
}

export default function App() {
  useEffect(() => () => disposeAmbient(), [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Seo />
      <A11yNav />
      <header className="pointer-events-none absolute top-4 left-4 z-20 max-w-xs">
        <p className="text-2xl text-[#f6efe4]">{site.name}</p>
        <p className="text-sm text-[#e7b56a]">{site.role}</p>
      </header>
      <Suspense fallback={<VoxelLoader />}>
        <CanvasApp />
      </Suspense>
      <AssetLoader />
      <Overlays />
    </div>
  )
}
