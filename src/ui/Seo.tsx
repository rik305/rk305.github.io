import { useEffect } from 'react'
import { site } from '../content/site'

export function Seo() {
  useEffect(() => {
    document.title = site.title
  }, [])
  return null
}
