import { useEffect, useState } from 'react'

function detectMobile() {
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
}

export function useIsMobile() {
  const [mobile, setMobile] = useState(detectMobile)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const narrow = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(coarse.matches || narrow.matches)
    update()
    coarse.addEventListener('change', update)
    narrow.addEventListener('change', update)
    return () => {
      coarse.removeEventListener('change', update)
      narrow.removeEventListener('change', update)
    }
  }, [])

  return mobile
}
