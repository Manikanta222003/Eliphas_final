import { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

const inputStyle = { width:'100%', padding:'10px 12px', border:'1px solid #ccc', borderRadius:'4px', fontSize:'14px', boxSizing:'border-box' }
const btnPrimary = { width:'100%', padding:'12px', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:'4px', fontSize:'15px', cursor:'pointer', fontWeight:'600', marginTop:'4px' }

function Alert({ msg, type }) {
  if (!msg) return null
  return (
    <div style={{ padding:'10px 14px', borderRadius:'4px', marginBottom:'16px',
      background: type==='success'?'#d4edda': type==='info'?'#d1ecf1':'#f8d7da',
      color:      type==='success'?'#155724': type==='info'?'#0c5460':'#721c24', fontSize:'13px' }}>
      {msg}
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [alert,    setAlert]    = useState({ msg:'', type:'' })

  const [query,     setQuery]    = useState('')
  const [results,   setResults]  = useState([])
  const [searchMsg, setSearchMsg]= useState('')
  const [searching, setSearching]= useState(false)
  const [searched,  setSearched] = useState(false)

  const submitLogin = async () => {
    if (!username.trim() || !password.trim()) { setAlert({ msg:'Please enter username and password.', type:'error' }); return }
    try {
      setLoading(true); setAlert({ msg:'', type:'' })
      const res = await API.post('/auth/login', { username, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user',  JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setAlert({ msg: err.response?.data?.message || 'Invalid username or password.', type:'error' })
    } finally { setLoading(false) }
  }

  const search = async () => {
    if (!query.trim()) { setSearchMsg('Please enter a vehicle number or challan number.'); setResults([]); return }
    try {
      setSearching(true); setSearchMsg('')
      const [r1, r2] = await Promise.all([
        API.get(`/billing/search?vehicleNumber=${encodeURIComponent(query.trim())}`),
        API.get(`/billing/search?challanNumber=${encodeURIComponent(query.trim())}`)
      ])
      const merged = [...r1.data, ...r2.data]
      const unique = Array.from(new Map(merged.map(r => [r._id, r])).values())
      setResults(unique); setSearched(true)
      if (unique.length === 0) setSearchMsg(`No records found for "${query}"`)
    } catch { setSearchMsg('Search failed. Please try again.') }
    finally { setSearching(false) }
  }

  return (
    <div style={{ fontFamily:'Arial, sans-serif', minHeight:'100vh', background:'#f0f2f5' }}>
      <div style={{ background:'#1a1a2e', padding:'0 32px', height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:'20px', fontWeight:'700', color:'#fff' }}>ELIPHAS Billing</span>
        <button onClick={() => navigate('/')} style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.3)', color:'#ccc', padding:'5px 14px', borderRadius:'4px', cursor:'pointer', fontSize:'13px' }}>
          ← Back to Website
        </button>
      </div>

      <div style={{ background:'#fff', borderBottom:'1px solid #e0e0e0', padding:'20px 32px' }}>
        <h3 style={{ margin:'0 0 12px 0', color:'#1a1a2e', fontSize:'15px' }}>🔍 Track a Trip — Search by Vehicle or Challan Number</h3>
        <div style={{ display:'flex', gap:'10px', maxWidth:'540px' }}>
          <input style={{ ...inputStyle, flex:1 }} placeholder="Enter vehicle number or challan number..."
            value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key==='Enter' && search()} />
          <button onClick={search} disabled={searching}
            style={{ padding:'10px 22px', background:'#1a1a2e', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:'600', whiteSpace:'nowrap' }}>
            {searching ? '...' : 'Search'}
          </button>
          {searched && (
            <button onClick={() => { setQuery(''); setResults([]); setSearchMsg(''); setSearched(false) }}
              style={{ padding:'10px 14px', background:'transparent', border:'1px solid #ccc', borderRadius:'4px', cursor:'pointer', color:'#555' }}>
              Clear
            </button>
          )}
        </div>
        {searchMsg && <p style={{ color:'#888', marginTop:'10px', fontSize:'13px' }}>{searchMsg}</p>}
        {results.length > 0 && (
          <div style={{ marginTop:'14px', overflowX:'auto' }}>
            <p style={{ fontSize:'13px', color:'#555', marginBottom:'8px' }}>{results.length} record(s) found</p>
            <table style={{ borderCollapse:'collapse', fontSize:'13px', width:'100%', maxWidth:'860px' }}>
              <thead>
                <tr style={{ background:'#1a1a2e', color:'#fff' }}>
                  {['Client Name','Vehicle No.','Challan No.','From','To','Load Type','Date'].map(h => (
                    <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontWeight:'600' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r._id} style={{ background: i%2===0?'#fff':'#f9f9f9', borderBottom:'1px solid #eee' }}>
                    <td style={{ padding:'8px 12px' }}>{r.clientName}</td>
                    <td style={{ padding:'8px 12px' }}>{r.vehicleNumber}</td>
                    <td style={{ padding:'8px 12px' }}>{r.challanNumber}</td>
                    <td style={{ padding:'8px 12px' }}>{r.fromLocation}</td>
                    <td style={{ padding:'8px 12px' }}>{r.toLocation}</td>
                    <td style={{ padding:'8px 12px' }}>{r.loadType}</td>
                    <td style={{ padding:'8px 12px' }}>{r.date ? new Date(r.date).toLocaleDateString('en-IN') : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize:'11px', color:'#bbb', marginTop:'6px' }}>* Fare details are visible only after login.</p>
          </div>
        )}
      </div>

      <div style={{ display:'flex', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ background:'#fff', padding:'36px 40px', borderRadius:'8px', boxShadow:'0 2px 14px rgba(0,0,0,0.10)', width:'380px' }}>
          <h2 style={{ marginTop:0, marginBottom:'4px', color:'#1a1a2e', fontSize:'20px' }}>Staff Login</h2>
          <p style={{ color:'#888', fontSize:'13px', marginTop:0, marginBottom:'22px' }}>Admin & Manager access only</p>
          <Alert msg={alert.msg} type={alert.type} />
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px' }}>Username</label>
            <input style={inputStyle} placeholder="Enter username" value={username}
              onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key==='Enter' && submitLogin()} />
          </div>
          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px' }}>Password</label>
            <input style={inputStyle} type="password" placeholder="Enter password" value={password}
              onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key==='Enter' && submitLogin()} />
          </div>
          <button onClick={submitLogin} disabled={loading} style={{ ...btnPrimary, opacity: loading?0.7:1 }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
        </div>
      </div>
    </div>
  )
}
