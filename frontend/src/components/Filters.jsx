import { useMemo } from 'react'
import { formatCurrency } from '../utils/format.js'

export default function Filters({ airlinesOptions = [], priceRange, filters, onChange }) {
  const min = priceRange?.min ?? 0
  const max = priceRange?.max ?? 1000
  const value = Math.min(filters.maxPrice ?? max, max)

  const airlinesSorted = useMemo(() => [...airlinesOptions].sort((a,b)=>a.localeCompare(b)), [airlinesOptions])
  const toggleStop = (label) => onChange({ ...filters, stops: { ...filters.stops, [label]: !filters.stops[label] } })
  const toggleAirline = (name) => onChange({ ...filters, airlines: { ...filters.airlines, [name]: !filters.airlines[name] } })

  return (
    <aside className="card-custom card-p-6 sticky">
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Filter Results</h3>

      <div style={{ marginBottom: 24 }}>
        <div className="form-label-custom">Stops</div>
        <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
          {['0','1','2+'].map(s => (
            <label key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" style={{ marginRight: 8 }} checked={!!filters.stops[s]} onChange={() => toggleStop(s)} />
              {s === '0' ? 'Nonstop' : s === '1' ? '1 stop' : '2+ stops'}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="form-label-custom">Airlines</div>
        <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
          {airlinesSorted.length === 0 && <div style={{ color: '#6b7280' }}>No airline filters</div>}
          {airlinesSorted.map(a => (
            <label key={a} style={{ display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" style={{ marginRight: 8 }} checked={!!filters.airlines[a]} onChange={() => toggleAirline(a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label-custom">Max Price</label>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })} style={{ width: '100%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4b5563', marginTop: 4 }}>
          <span>{formatCurrency(min)}</span>
          <span style={{ fontWeight: 600, color: '#111827' }}>{formatCurrency(value)}</span>
          <span>{formatCurrency(max)}</span>
        </div>
      </div>
    </aside>
  )
}