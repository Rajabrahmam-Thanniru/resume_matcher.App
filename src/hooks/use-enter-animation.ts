import { useEffect, useRef } from "react"
import { animate, createScope, stagger, type Scope } from "animejs"

export function useEnterAnimation(selector = "[data-enter]") {
  const root = useRef<HTMLDivElement>(null)
  const scope = useRef<Scope | null>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    scope.current = createScope({ root }).add(() => {
      animate(selector, {
        opacity: { from: 0 },
        y: { from: 14 },
        duration: 520,
        delay: stagger(70),
        ease: "out(3)",
      })
    })
    return () => scope.current?.revert()
  }, [selector])

  return root
}
