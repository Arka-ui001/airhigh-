import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AIRPORTS = [
  'JFK - New York (JFK)','LAX - Los Angeles (LAX)','SFO - San Francisco (SFO)','ORD - Chicago O’Hare (ORD)',
  'ATL - Atlanta (ATL)','SEA - Seattle (SEA)','DFW - Dallas-Fort Worth (DFW)','MIA - Miami (MIA)'
]

function toIata(val) {
  const m = (val || '').match(/\(([A-Z]{3})\)$/)
  if (m) return m[1]
  return (val || '').trim().toUpperCase().slice(0, 3)
}

export default function SearchForm({ preset = {} }) {
  const [from, setFrom] = useState(preset.from || '')
  const [to, setTo] = useState(preset.to || '')
  const [date, setDate] = useState(preset.date || '')
  const [dateType, setDateType] = useState('text') // show dd-mm-yyyy until focus
  // passengers starts BLANK; default to 1 on submit
  const [passengers, setPassengers] = useState(
    preset.passengers != null ? String(preset.passengers) : ''
  )

  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    const f = toIata(from), t = toIata(to)
    if (!/^[A-Z]{3}$/.test(f) || !/^[A-Z]{3}$/.test(t)) return alert('Use 3-letter airport codes (e.g., JFK, LAX)')
    if (f === t) return alert('From and To cannot be the same.')
    if (!date) return alert('Please choose a date.')
    const pax = Math.max(1, parseInt(passengers, 10) || 1)
    navigate(`/results?from=${f}&to=${t}&date=${date}&passengers=${pax}`)
  }

  return (
    <div className="search-float">
      <form onSubmit={handleSubmit} className="search-card">
        <h2 className="search-title">Search Flights</h2>

        <div className="search-row">
          {/* From */}
          <div className="field">
            <label className="form-label-custom">From</label>
            <div className="field-wrap">
              <span className="field-icon" style={{ pointerEvents: 'none' }}>
                <svg className="lucide-sm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z"/></svg>
              </span>
              <input
                list="airports"
                className="input-field-custom field-input"
                placeholder="City or Airport"
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
            </div>
          </div>

          {/* To */}
          <div className="field">
            <label className="form-label-custom">To</label>
            <div className="field-wrap">
              <span className="field-icon" style={{ pointerEvents: 'none' }}>
                <svg className="lucide-sm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z"/></svg>
              </span>
              <input
                list="airports"
                className="input-field-custom field-input"
                placeholder="City or Airport"
                value={to}
                onChange={e => setTo(e.target.value)}
              />
            </div>
          </div>
{/* Date (native picker only, no left icon) */}
<div className="field">
  <label className="form-label-custom">Departure Date</label>
  <div className="field-wrap date-wrap">
    <input
      type="date"
      className="input-field-custom field-input"
      value={date}
      onChange={e => setDate(e.target.value)}
    />
  </div>
</div>

          {/* Passengers — small box, starts blank (no placeholder text) */}
          <div className="field">
            <label className="form-label-custom">Passengers</label>
            <div className="field-wrap passenger-wrap" style={{ position: 'relative' }}>
              <span className="field-icon" style={{ pointerEvents: 'none' }}>
                <svg className="lucide-sm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="number"
                min={1}
                step={1}
                className="input-field-custom field-input pax-input"
                value={passengers}
                onChange={e => setPassengers(e.target.value)}  // allow blank
                aria-label="Passengers"
              />
            </div>
          </div>

          {/* Search */}
          <div className="field">
            <label className="form-label-custom" style={{ visibility: 'hidden' }}>Search</label>
            <button type="submit" className="btn-custom btn-primary-custom search-btn">
              <svg className="lucide-sm" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              Search
            </button>
          </div>
        </div>

        <datalist id="airports">
          {AIRPORTS.map(a => <option key={a} value={a} />)}
        </datalist>
      </form>
    </div>
  )
}