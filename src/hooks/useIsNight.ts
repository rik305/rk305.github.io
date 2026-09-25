import { useEffect, useState } from 'react'

function nightAt(date: Date) {
  const hour = date.getHours()
  return hour >= 20 || hour < 7
}

export function useIsNight() {
  const [night, setNight] = useState(() => nightAt(new Date()))

  useEffect(() => {
    const update = () => setNight(nightAt(new Date()))
    update()
    const id = window.setInterval(update, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return night
}
