import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import FlightList from '../components/FlightList'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export default function Results() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { state } = useLocation()

  // Read params from URL; fallback to location state if present
  const from = (searchParams.get('from') || state?.from || '').toUpperCase()
  const to = (searchParams.get('to') || state?.to || '').toUpperCase()
  const date = searchParams.get('date') || state?.date || ''
  const passengers = Number(searchParams.get('passengers') || state?.passengers || 1)

  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchFlights() {
      // Guard: need from/to to search
      if (!from || !to) {
        setFlights([])
        setLoading(false)
        setError('Enter valid from/to airports and search again.')
        return
      }

      setLoading(true)
      setError('')
      try {
        const qs = new URLSearchParams({
          from,
          to,
          ...(date ? { date } : {}),
          passengers: String(passengers || 1),
        })
        const res = await fetch(`${API_BASE}/flights/search?${qs.toString()}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) {
          const text = await res.text().catch(() => '')
          throw new Error(`HTTP ${res.status}: ${text}`)
        }
        const data = await res.json()
        if (!ignore) setFlights(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching flights:', err)
        if (!ignore) {
          setError('Failed to load flights')
          setFlights([])
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchFlights()
    return () => { ignore = true }
  }, [from, to, date, passengers])

  // Normalize and forward to booking
  const handleSelect = (f) => {
    const flight = {
      id: f.id ?? f._id,
      airline: f.airline,
      airlineCode: f.airlineCode,
      flightNumber: f.flightNumber,
      from: f.from,
      to: f.to,
      departTime: f.departTime ?? f.departureTime ?? f.departure,
      arriveTime: f.arriveTime ?? f.arrivalTime ?? f.arrival,
      price: f.price ?? f.totalFare ?? 0,
      date,
      passengers,
    }
    navigate('/booking', { state: { flight } })
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <div className="card-custom card-p-4" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>
          {from || '—'} → {to || '—'}
        </div>
        <div style={{ color: '#6b7280', marginTop: 4 }}>
          {date || 'No date'} • {passengers} pax
        </div>
      </div>

      {loading && <p>Loading flights...</p>}
      {!loading && error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!loading && !error && flights.length === 0 && <p>No flights found.</p>}
      {!loading && !error && flights.length > 0 && (
        <FlightList flights={flights} onSelect={handleSelect} />
      )}
    </div>
  )
}