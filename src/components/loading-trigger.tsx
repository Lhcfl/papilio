import type { HTMLProps } from 'react'

export const LoadingTrigger = (props: {
  onShow: () => void
  children?: React.ReactNode
} & HTMLProps<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null)
  const { onShow, children, ...divProps } = props

  useEffect(() => {
    const observer = new IntersectionObserver((ent) => {
      if (ent[0].isIntersecting) {
        onShow()
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [onShow])

  return <div ref={ref} {...divProps}>{children}</div>
}
