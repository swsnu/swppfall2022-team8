import { useEffect, useRef } from 'react'

const useInterval = (callback: () => void, ms: number) => {
  const savedCallBack = useRef(callback)

  useEffect(() => {
    savedCallBack.current = callback
  }, [callback])

  useEffect(() => {
    const timerId = setInterval(() => savedCallBack.current(), ms)
    return () => clearInterval(timerId)
  }, [])
}

export default useInterval
