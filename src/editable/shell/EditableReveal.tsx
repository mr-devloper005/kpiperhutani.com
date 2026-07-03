'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  /** Stagger index; each step adds ~80ms of transition-delay. */
  index?: number
  /** Optional per-item extra delay in ms. */
  delayMs?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'ul'
  /** Trigger once (default) or every time it re-enters the viewport. */
  once?: boolean
}

/*
  IntersectionObserver-driven fade + slide-up.

  - The element renders visible on the server (no `is-visible` needed) so a
    JS-off visitor sees the content immediately.
  - Once the client mounts, we add `editable-reveal-armed` which hides the
    element until the observer marks it visible again.
  - Stagger is per-item via inline `transitionDelay`.
*/
export function EditableReveal({
  children,
  index = 0,
  delayMs = 0,
  className = '',
  as = 'div',
  once = true,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setArmed(true)
    const node = ref.current
    if (!node) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [once])

  const Tag = as as unknown as 'div'
  const style: CSSProperties = { transitionDelay: `${index * 80 + delayMs}ms` }
  const cls = [
    'editable-reveal',
    armed ? 'editable-reveal-armed' : '',
    armed && visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref as never} className={cls} style={style}>
      {children}
    </Tag>
  )
}
