import { useNavigate, useSearchParams } from 'react-router-dom'

export default function FlightList({ flights = [], onSelect }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const qpDate = searchParams.get('date') || ''
  const qpPassengers = Number(searchParams.get('passengers') || '1')

  const fmtINR = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })

  const getInitials = (name = '') => {
    const parts = String(name).trim().split(/\s+/)
    return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase()
  }

  // Normalize possible field names coming from API/JSON
  const normalizeFlight = (f) => ({
    id: f.id ?? f._id ?? `${(f.airlineCode || '')}${(f.flightNumber || '')}-${(f.from || f.origin || '')}-${(f.to || f.destination || '')}`,
    airline: f.airline ?? f.airlineName ?? 'Airline',
    airlineCode: f.airlineCode ?? f.carrierCode ?? '',
    flightNumber: f.flightNumber ?? f.number ?? '',
    from: f.from ?? f.origin ?? f.originCode ?? '',
    to: f.to ?? f.destination ?? f.destinationCode ?? '',
    departTime: f.departTime ?? f.departureTime ?? f.departure ?? f.depTime ?? '',
    arriveTime: f.arriveTime ?? f.arrivalTime ?? f.arrival ?? f.arrTime ?? '',
    durationMinutes: f.durationMinutes ?? f.duration ?? f.totalDurationMin ?? 0,
    stops: (f.stops ?? f.stopCount ?? f.stopsCount ?? 0),
    aircraft: f.aircraft ?? f.aircraftType ?? '',
    price: f.price ?? f.fare ?? f.amount ?? f.totalFare ?? 0,
    date: f.date ?? qpDate,
    passengers: f.passengers ?? qpPassengers,
  })

  const handleSelect = (raw) => {
    const flight = normalizeFlight(raw)
    if (onSelect) {
      onSelect(flight)
    } else {
      navigate('/booking', { state: { flight } })
    }
  }

  if (!Array.isArray(flights) || flights.length === 0) {
    return <div className="flight-list" />
  }

  return (
    <div className="flight-list">
      {flights.map((raw, idx) => {
        const f = normalizeFlight(raw)
        return (
          <div key={f.id || idx} className="flight-row card-custom">
            <div className="row-left">
              <div className="airline-badge">{getInitials(f.airline)}</div>
              <div>
                <div className="airline"><b>{f.airline}</b> {f.flightNumber}</div>
                <div className="route">{f.from} → {f.to}</div>
                <div className="times">{f.departTime} – {f.arriveTime}</div>
                <div className="meta">
                  {f.durationMinutes} min • {f.stops === 0 ? 'Non‑stop' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>

            <div className="row-right">
              <div className="price-strong">{fmtINR.format(f.price || 0)}</div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSelect(raw)}
              >
                Select Flight
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}