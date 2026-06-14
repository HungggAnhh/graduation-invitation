import { useState, useEffect, useRef } from 'react'

export function useTypewriter(text: string, speed = 30) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsTyping(true)
    setDisplayText('')

    let index = 0
    const type = () => {
      if (index < text.length) {
        setDisplayText(text.substring(0, index + 1))
        index++
        timerRef.current = setTimeout(type, speed)
      } else {
        setIsTyping(false)
      }
    }

    type()

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [text, speed])

  const completeText = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setDisplayText(text)
    setIsTyping(false)
  }

  return { displayText, isTyping, completeText }
}
