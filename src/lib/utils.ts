import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise<void>((res, rej) => {
      if (document.execCommand('copy')) {
        res()
      }
      else {
        rej()
      }
      textArea.remove()
    })
  }
}

export function withStopPrevent<Ev extends {
  stopPropagation: () => void
  preventDefault: () => void
}, T>(fn: (ev: Ev) => T): (ev: Ev) => T {
  return (ev: Ev) => {
    ev.stopPropagation()
    ev.preventDefault()
    return fn(ev)
  }
}

export function onlyWhenNonInteractableContentClicked<Ev extends {
  stopPropagation: () => void
  preventDefault: () => void
  target: object
}, T>(fn: (ev: Ev) => T): (ev: Ev) => T | undefined {
  return (ev: Ev) => {
    const target = ev.target as Element
    console.log(target)
    if (
      target.closest('a')
      || target.closest('button')
    ) {
      if (import.meta.env.DEV) {
        console.log(
          target.closest('a'),
          target.closest('button'),
        )
      }
      return
    }
    if (window.getSelection()?.toString()) {
      if (import.meta.env.DEV) {
        console.log(window.getSelection()?.toString())
      }
      return
    }
    ev.stopPropagation()
    ev.preventDefault()
    return fn(ev)
  }
}
