import { minutesToHM, formatCurrency } from '../utils/format.js'

export default function FlightCard({ f }) {
  return (
    <div className="card-custom">
      <div className="card-p-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 999, background: '#0ea5e9', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>
            {f.airline?.substring(0,2)}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{f.airline}</div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>{f.flightNumber} · {f.aircraft}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500 }}>{f.departTime}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{f.from}</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500 }}>{f.arriveTime}</div>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{f.to}</div>
        </div>

        <div style={{ textAlign: 'center', fontSize: 14, color: '#4b5563' }}>
          {minutesToHM(f.durationMinutes)} | {f.stops === 0 ? 'Non-stop' : f.stops === 1 ? '1 stop' : '2+ stops'}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0369a1' }}>{formatCurrency(f.price)}</div>
          <button className="btn-custom btn-primary-custom" style={{ fontSize: 14, marginTop: 8, padding: '8px 12px' }}>Select Flight</button>
        </div>
      </div>
    </div>
  )
}