import './Hero.css'
import { useEffect, useRef, useState } from 'react'
import img1 from '../assets/hero1.jpeg'
import img2 from '../assets/hero2.jpeg'
import img3 from '../assets/hero3.jpeg'
import img4 from '../assets/hero4.jpeg'
import img5 from '../assets/hero5.jpeg'
import img6 from '../assets/hero6.jpeg'
import img7 from '../assets/hero7.jpeg'
import img8 from '../assets/hero8.jpeg'

const CAROUSEL_IMAGES = [img1, img2, img3, img4, img5, img6, img7, img8]
const SLIDE_DURATION = 5000

// Per-slide content: slide 0 = default, slide 1 = custom text, rest = default
const SLIDE_CONTENT = [
  {
    eyebrow: 'Multi-Domain Service Provider',
    h1: <>Welcome to Eliphas<br /><em>Shipping Services </em> .</>,
    sub: 'Eliphas Shipping Services Pvt Ltd — delivering operational excellence across Logistics, Mining, Civil Works, Heavy Engineering, Pipe Lines, Roads & Highways, Commercial & Residential, Shipping & Transportation, and Materials Supply.',
  },
  {
    eyebrow: 'Welcome to Eliphas Shipping Services',
    h1: <>Your Trusted<br /><em>Partner</em></>,
    sub: 'Eliphas Shipping Services Pvt Ltd — a professionally managed, multi-domain infrastructure and logistics company headquartered in Visakhapatnam, Andhra Pradesh.',
  },
  {
    eyebrow: 'Multi-Domain Service Provider',
    h1: <>Welcome to Eliphas<br /><em>Shipping Services </em> .</>,
    sub: 'Eliphas Shipping Services Pvt Ltd — delivering operational excellence across Logistics, Mining, Civil Works, Heavy Engineering, Pipe Lines, Roads & Highways, Commercial & Residential, Shipping & Transportation, and Materials Supply.',
  },
  {
    eyebrow: 'Welcome to Eliphas Shipping Services',
    h1: <>Your Trusted<br /><em>Partner</em></>,
    sub: 'Eliphas Shipping Services Pvt Ltd — a professionally managed, multi-domain infrastructure and logistics company headquartered in Visakhapatnam, Andhra Pradesh.',
  },
  {
    eyebrow: 'Multi-Domain Service Provider',
    h1: <>Welcome to Eliphas<br /><em>Shipping Services </em> .</>,
    sub: 'Eliphas Shipping Services Pvt Ltd — delivering operational excellence across Logistics, Mining, Civil Works, Heavy Engineering, Pipe Lines, Roads & Highways, Commercial & Residential, Shipping & Transportation, and Materials Supply.',
  },
  {
    eyebrow: 'Welcome to Eliphas Shipping Services',
    h1: <>Your Trusted<br /><em>Partner</em></>,
    sub: 'Eliphas Shipping Services Pvt Ltd — a professionally managed, multi-domain infrastructure and logistics company headquartered in Visakhapatnam, Andhra Pradesh.',
  },
  {
    eyebrow: 'Multi-Domain Service Provider',
    h1: <>Welcome to Eliphas<br /><em>Shipping Services </em> .</>,
    sub: 'Eliphas Shipping Services Pvt Ltd — delivering operational excellence across Logistics, Mining, Civil Works, Heavy Engineering, Pipe Lines, Roads & Highways, Commercial & Residential, Shipping & Transportation, and Materials Supply.',
  },
  {
    eyebrow: 'Welcome to Eliphas Shipping Services',
    h1: <>Your Trusted<br /><em>Partner</em></>,
    sub: 'Eliphas Shipping Services Pvt Ltd — a professionally managed, multi-domain infrastructure and logistics company headquartered in Visakhapatnam, Andhra Pradesh.',
  },
  
  
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideTimerRef = useRef(null)

  const goToSlide = (index) => setCurrentSlide((index + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length)
  const nextSlide = () => goToSlide(currentSlide + 1)
  const prevSlide = () => goToSlide(currentSlide - 1)

  useEffect(() => {
    slideTimerRef.current = setInterval(nextSlide, SLIDE_DURATION)
    return () => clearInterval(slideTimerRef.current)
  }, [currentSlide])

  const heroImgRef = useRef(null)
  const heroH1Ref  = useRef(null)
  const heroSubRef = useRef(null)
  const heroOvRef  = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const sy = window.scrollY
        if (sy < window.innerHeight) {
          const p = sy / window.innerHeight
          if (heroImgRef.current)  heroImgRef.current.style.transform  = `scale(1.06) translateY(${sy * 0.25}px)`
          if (heroH1Ref.current)   heroH1Ref.current.style.transform   = `translateY(${sy * 0.08}px) translateZ(0)`
          if (heroSubRef.current)  heroSubRef.current.style.transform  = `translateY(${sy * 0.05}px)`
          if (heroOvRef.current)   heroOvRef.current.style.opacity     = 0.85 + p * 0.15
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleHsEnter = (e) => {
    const num = e.currentTarget.querySelector('.hs-n')
    if (num) num.style.transform = 'perspective(300px) translateZ(16px) rotateX(-6deg)'
  }
  const handleHsLeave = (e) => {
    const num = e.currentTarget.querySelector('.hs-n')
    if (num) num.style.transform = ''
  }

  const content = SLIDE_CONTENT[currentSlide] || SLIDE_CONTENT[0]

  return (
    <section id="hero">
      {/* Background carousel */}
      <div ref={heroImgRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {CAROUSEL_IMAGES.map((src, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: i === currentSlide ? 0.35 : 0,
            transition: 'opacity 1.2s ease',
          }} />
        ))}
      </div>

      <div className="hero-ov" ref={heroOvRef}></div>

      {/* Slide content — fades with slide change */}
      <div className="hero-content" key={currentSlide} style={{ animation: 'heroContentFade .7s ease forwards' }}>
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-line"></span>
          {content.eyebrow}
        </p>
        <h1 className="hero-h1" ref={heroH1Ref}>{content.h1}</h1>
        <p className="hero-sub" ref={heroSubRef}>{content.sub}</p>
        <div className="hero-acts">
          <a href="#services" className="btn-primary">Explore Services &rarr;</a>
          <a href="#contact" className="btn-outline">Get in Touch</a>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hs" onMouseEnter={handleHsEnter} onMouseLeave={handleHsLeave}>
          <div className="hs-n">9+</div><div className="hs-l">Core Services</div>
        </div>
        <div className="hs-div"></div>
        <div className="hs" onMouseEnter={handleHsEnter} onMouseLeave={handleHsLeave}>
          <div className="hs-n">100%</div><div className="hs-l">Safety Focused</div>
        </div>
        <div className="hs-div"></div>
        <div className="hs" onMouseEnter={handleHsEnter} onMouseLeave={handleHsLeave}>
          <div className="hs-n">E-2-E</div><div className="hs-l">Execution</div>
        </div>
      </div>

      <div className="scroll-cue"><span>Scroll</span><div className="scroll-line"></div></div>

      {/* Carousel controls */}
      <button onClick={prevSlide} style={arrowStyle('left')} aria-label="Previous slide">&#8249;</button>
      <button onClick={nextSlide} style={arrowStyle('right')} aria-label="Next slide">&#8250;</button>

      <div style={dotsWrapStyle}>
        {CAROUSEL_IMAGES.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} aria-label={`Go to slide ${i + 1}`}
            style={{ ...dotStyle, background: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.35)', transform: i === currentSlide ? 'scale(1.3)' : 'scale(1)' }}
          />
        ))}
      </div>
    </section>
  )
}

const arrowStyle = (side) => ({
  position: 'absolute', top: '50%', [side]: '2rem',
  transform: 'translateY(-50%)', zIndex: 10,
  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
  color: '#ffffff', fontSize: '2.2rem', lineHeight: 1,
  width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.3s', backdropFilter: 'blur(4px)',
})
const dotsWrapStyle = {
  position: 'absolute', bottom: '5.5rem', left: '50%',
  transform: 'translateX(-50%)', zIndex: 10,
  display: 'flex', gap: '0.5rem', alignItems: 'center',
}
const dotStyle = {
  width: '8px', height: '8px', borderRadius: '50%',
  border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease',
}
