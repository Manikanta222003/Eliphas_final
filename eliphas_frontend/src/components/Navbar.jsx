import './Navbar.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Navbar({ barGone }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeNav  = () => { setMobileOpen(false); document.body.style.overflow = '' }
  const openNav   = () => { setMobileOpen(true);  document.body.style.overflow = 'hidden' }
  const toggleNav = () => mobileOpen ? closeNav() : openNav()

  const navLinks = [
    { href: '#hero',      label: 'Home' },
    { href: '#about',     label: 'About' },
    { href: '#services',  label: 'Services' },
    { href: '#locations', label: 'Locations' },
    { href: '#why',       label: 'Why Us' },
    { href: '#board',     label: 'Leadership' },
    { href: '#contact',   label: 'Contact' },
  ]

  const PortalIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  )

  return (
    <>
      <nav
        id="mainNav"
        className={`${scrolled ? 'sc' : ''}${barGone ? ' bar-gone' : ''}`}
        style={{ top: barGone ? '0' : '34px' }}
      >
        <a href="#hero" className="logo">
          <div className="logo-sign-wrap">
            <div className="logo-sign-ring"></div>
            <img src={logo} alt="Eliphas Logo" className="logo-img-nav" />
          </div>
        </a>

        <ul className="nav-ul">
          {navLinks.map(link => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>

        <div className="nav-right">
          <button
            onClick={() => navigate('/login')}
            className="nav-login"
            title="Staff Login"
          >
            <PortalIcon />
            Staff Login
          </button>
          <a href="#contact" className="nav-cta">Enquire Now</a>
        </div>

        <button
          className={`hamburger${mobileOpen ? ' open' : ''}`}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={toggleNav}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mob-overlay${mobileOpen ? ' open' : ''}`} onClick={closeNav}></div>

      <div className={`mob-nav${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mob-nav-hdr">
          <img src={logo} alt="Eliphas Logo" className="mob-nav-logo" />
          <button className="mob-nav-x" onClick={closeNav} aria-label="Close menu">&#x2715;</button>
        </div>
        <ul className="mob-links">
          {navLinks.map(link => (
            <li key={link.href}>
              <a href={link.href} className="mob-lk" onClick={closeNav}>
                {link.label} <span className="mob-arr">›</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mob-ftr">
          <button
            onClick={() => { closeNav(); navigate('/login') }}
            className="mob-ftr-login"
          >
            <PortalIcon /> Staff Login
          </button>
          <a href="#contact" className="mob-ftr-cta mob-lk" onClick={closeNav}>Enquire Now →</a>
        </div>
      </div>
    </>
  )
}
