import { useEffect, useState } from 'preact/hooks'

export const Loader = ({ active = true }) => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!active || opacity >= 1.0) return
    const fadeIn = setTimeout(() => setOpacity(opacity + 0.05), 200)
    return () => clearTimeout(fadeIn)
  }, [active, opacity])

  if (!active) return null

  return <div className='loader' style={{ opacity }}>
    <div className='bounce1 inline-block'></div>
    <div className='bounce2 inline-block'></div>
    <div className='bounce3 inline-block'></div>
  </div>
}
