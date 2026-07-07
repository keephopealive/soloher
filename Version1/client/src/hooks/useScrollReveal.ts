import { useEffect, useRef } from 'react'

export function useScrollReveal<T extends HTMLElement = HTMLElement>(delay = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.classList.contains('reveal')) {
            setTimeout(() => el.classList.add('in'), delay)
          }
          el.querySelectorAll<HTMLElement>('.reveal').forEach(child => {
            setTimeout(() => child.classList.add('in'), delay)
          })
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}
