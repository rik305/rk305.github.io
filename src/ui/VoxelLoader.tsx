type VoxelLoaderProps = {
  progress?: number | null
}

export function VoxelLoader({ progress = null }: VoxelLoaderProps) {
  const width = progress == null ? 35 : Math.max(8, Math.min(100, progress))
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-[#1c1410]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-64">
        <div className="mb-3 flex items-end gap-1" aria-hidden="true">
          <span className="h-4 w-4 bg-[#6b3e2a]" />
          <span className="h-7 w-4 bg-[#c4522a] motion-safe:animate-pulse" />
          <span className="h-5 w-4 bg-[#e7b56a]" />
          <span className="h-8 w-4 bg-[#d8c09a]" />
          <span className="h-6 w-4 bg-[#2f5d50]" />
        </div>
        <div className="h-3 border border-[#e7b56a]/70 bg-[#2a1a12]">
          <div
            className="h-full bg-[#c4522a] transition-[width] duration-300"
            style={{ width: `${width}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-[#f6efe4]">
          {progress == null ? 'Building the room' : `Loading ${Math.round(progress)}%`}
        </p>
      </div>
    </div>
  )
}
