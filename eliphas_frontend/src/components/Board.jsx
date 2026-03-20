import './Board.css'
import { useRef } from 'react'
import dir1 from '../assets/dir1.png'
import dir2 from '../assets/dir2.png'

const directors = [
  {
    initials: 'EC',
    name: 'CHILAKAMARTHI VEERRAJU',
    role: 'Managing Director',
    bio: 'Visionary leader with deep expertise in logistics, infrastructure, and multi-domain project management across Andhra Pradesh and beyond.',
    tags: ['Logistics', 'Infrastructure', 'Project Management', 'Strategy'],
    num: '01',
    photo: dir1,  // ✅ imported variable
  },
  {
    initials: 'SP',
    name: 'DESINEEDI HARIPRASAD',
    role: 'Director — Operations',
    bio: 'Operations specialist with extensive experience in civil works execution, supply chain coordination, and safety compliance frameworks.',
    tags: ['Civil Works', 'Supply Chain', 'Safety & Compliance', 'Operations'],
    num: '02',
    photo: dir2,  // ✅ imported variable
  },
]

const stats = [
  { n: '9', accent: '+', label: 'Core Services' },
  { n: '100', accent: '%', label: 'Safety Record' },
  { n: 'E', accent: '-2-E', label: 'Project Execution' },
  { n: 'AP', accent: '', label: 'Andhra Pradesh HQ' },
]

const boardValues = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8.5-8 10C7.5 20.5 4 17 4 12V7l8-4z"/></svg>,
    title: 'Safety First',
    text: 'Every operation prioritises the safety of our workforce and stakeholders.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    title: 'Accountability',
    text: 'We own every outcome and stand by the commitments we make to clients.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: 'Execution Excellence',
    text: 'Timely delivery and cost-efficient solutions — without compromise on quality.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Client Partnership',
    text: 'Long-term relationships built on transparency, trust, and integrity.',
  },
]

const domains = [
  '01 Logistics & Shipping', '02 Mining Services', '03 Civil Works',
  '04 Heavy Engineering (IBR)', '05 Pipe Lines', '06 Roads & Highways',
  '07 Commercial & Residential', '08 Shipping & Transportation', '09 Materials Supply',
]

function DirCard({ dir }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card || window.matchMedia('(hover:none)').matches) return
    const r = card.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5
    const dy = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `perspective(800px) rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg) translateY(-8px)`
  }
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div className="dir-card rv" ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="dir-num">{dir.num}</div>

      <div className="dir-avatar-wrap">
        <div className="dir-avatar">
          <div className="dir-avatar-ring"></div>

          {/* ✅ FIXED: show photo if exists, otherwise show initials */}
          {dir.photo ? (
            <img
              src={dir.photo}
              alt={dir.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '50%',
                display: 'block',
                position: 'absolute',
                inset: 0,
              }}
            />
          ) : (
            <div className="dir-initials">{dir.initials}</div>
          )}

        </div>
      </div>

      <div className="dir-body">
        <div className="dir-name">{dir.name}</div>
        <div className="dir-role">{dir.role}</div>
        <div className="dir-bio">{dir.bio}</div>
        <div className="dir-tags">
          {dir.tags.map(t => <span key={t} className="dir-tag">{t}</span>)}
        </div>
      </div>
      <div className="dir-bar"></div>
    </div>
  )
}

export default function Board() {
  return (
    <section id="board">
      {/* Company Overview */}
      <div className="board-intro">
        <div className="board-intro-text rvl">
          <p className="section-tag light">About the Company</p>
          <h2 className="section-title light">Built on <em>Vision.</em><br />Driven by <em>Purpose.</em></h2>
          <div className="sbar light"></div>
          <p className="board-intro-body">
            Eliphas Shipping Services Pvt Ltd is a professionally managed, multi-domain service company headquartered in Visakhapatnam, Andhra Pradesh. Established with a clear mandate to deliver integrated infrastructure and logistics solutions, the company operates across nine core verticals — from Logistics &amp; Shipping and Mining Services to Heavy Engineering, Pipe Lines, Roads &amp; Highways, and Materials Supply.
            <br /><br />
            Registered under the Companies Act and GST compliant (<strong style={{ color: 'rgba(255,255,255,.8)' }}>GSTIN: 37AAICE3890P1ZU</strong>), Eliphas is backed by an experienced leadership team that brings decades of combined expertise in project management, civil infrastructure, marine operations, and industrial engineering. The company's operations are built on three foundational pillars: <em style={{ color: 'rgba(255,255,255,.7)' }}>Safety</em>, <em style={{ color: 'rgba(255,255,255,.7)' }}>Accountability</em>, and <em style={{ color: 'rgba(255,255,255,.7)' }}>Execution Excellence</em>.
            <br /><br />
            With an active corporate presence, a growing pan-India project portfolio, and a strong emphasis on end-to-end delivery, Eliphas is positioning itself as a trusted partner for large-scale industrial and infrastructure projects across the region.
          </p>
        </div>
        <div className="board-stats-wrap rvr">
          {stats.map(s => (
            <div key={s.label} className="board-stat">
              <div className="board-stat-n">{s.n}<span className="board-stat-accent">{s.accent}</span></div>
              <div className="board-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Profile Panel */}
      <div className="cp-panel rv">
        <div className="cp-left">
          <p className="section-tag light" style={{ marginBottom: '.8rem' }}>Company Profile</p>
          <h3 className="cp-heading">Eliphas Shipping Services <em>Pvt Ltd</em></h3>
          <p className="cp-sub">A professionally managed, multi-domain infrastructure &amp; logistics company headquartered in Visakhapatnam, Andhra Pradesh, India.</p>
          <div className="cp-facts">
            {[
              ['Type', 'Private Limited Company'],
              ['Industry', 'Infrastructure · Logistics · Engineering'],
              ['CIN', 'U52292AP2024PTC115930'],
              ['Corp. HQ', '#27-3-189/2, Official Colony, Srinagar, Gajuwaka, Vizag – 530026'],
              ['Reg. Office', 'Sardar Nest, Flat 402, Peddagantyada, Gajuwaka, Vizag – 530044'],
              ['GSTIN', '37AAICE3890P1ZU'],
              ['State', '37 – Andhra Pradesh, India'],
              ['Mobile', '+91 90006 88220 · +91 90599 02202 · +91 90006 88221'],
            ].map(([label, val]) => (
              <div key={label} className="cp-fact">
                <span className="cp-fact-label">{label}</span>
                <span className="cp-fact-val" style={label === 'GSTIN' || label === 'CIN' ? { fontFamily: 'monospace', letterSpacing: '.06em' } : {}}>{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cp-right">
          <div className="cp-domains-title">Core Service Domains</div>
          <div className="cp-domains">
            {domains.map(d => (
              <div key={d} className="cp-domain">
                <span className="cp-d-num">{d.slice(0, 2)}</span>
                <span className="cp-d-name">{d.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credentials Strip */}
      <div className="cred-strip rv">
        {[
          { title: 'GST Registered', desc: 'Fully compliant under Indian GST · GSTIN 37AAICE3890P1ZU', icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8.5-8 10C7.5 20.5 4 17 4 12V7l8-4z"/></svg> },
          { title: 'IBR Certified', desc: 'Certified Steam Distributors for Heavy Engineering & Boiler Works', icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg> },
          { title: 'Pan-India Operations', desc: 'Active project portfolio spanning multiple states across India', icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> },
          { title: 'Pvt. Ltd. Registered', desc: 'Incorporated under the Indian Companies Act with full statutory compliance', icon: <svg viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,48,.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
        ].map(c => (
          <div key={c.title} className="cred-item">
            <div className="cred-icon">{c.icon}</div>
            <div className="cred-body">
              <div className="cred-title">{c.title}</div>
              <div className="cred-desc">{c.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Board Heading */}
      <div className="board-grid-title rv">
        <p className="section-tag light" style={{ justifyContent: 'center', marginBottom: '.6rem' }}>Our Leadership</p>
        <h2 className="section-title light">Board of <em>Directors</em></h2>
        <div className="sbar light" style={{ margin: '1rem auto 0' }}></div>
      </div>

      {/* Director Cards */}
      <div className="board-grid">
        {directors.map(dir => <DirCard key={dir.num} dir={dir} />)}
      </div>

      {/* Values Strip */}
      <div className="board-values">
        {boardValues.map(v => (
          <div key={v.title} className="bv-item">
            <div className="bv-icon">{v.icon}</div>
            <div className="bv-title">{v.title}</div>
            <div className="bv-text">{v.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}