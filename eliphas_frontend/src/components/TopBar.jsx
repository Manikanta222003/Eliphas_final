import './TopBar.css'
import { useEffect, useState } from 'react'

export default function TopBar({ onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  const handleClose = () => {
    setVisible(false)
    onClose()
  }

  return (
    <div id="topBar" className={`top-bar${visible ? ' tb-visible' : ''}`}>
      <div className="top-bar-inner">
        <div className="tb-dot"></div>
        <span>Multi-Domain Infrastructure &amp; Logistics Services</span>
        <div className="tb-dot"></div>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>Trusted across India</span>
        <div className="tb-dot"></div>
      </div>
      <button className="top-bar-close" id="tbClose" onClick={handleClose} aria-label="Close">✕</button>
    </div>
  )
}
