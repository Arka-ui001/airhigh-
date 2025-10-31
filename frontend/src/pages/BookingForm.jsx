import { useLocation } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { createBooking } from '../api/booking.js'

export default function BookingForm() {
  const { state } = useLocation()
  const flight = state?.flight

  const initialPax = Math.max(1, Number(flight?.passengers || 1))

  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: initialPax }, () => ({
      name: '',
      age: '',
      gender: '',
      seatPreference: '',
    }))
  )
  const [contactMobile, setContactMobile] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const unitPrice = Number(flight?.price ?? 0)
  const totalPrice = useMemo(() => unitPrice * initialPax, [unitPrice, initialPax])

  if (!flight) {
    return (
      <div className="container">
        <div className="card-custom card-p-4">No flight selected.</div>
      </div>
    )
  }

  const handleChange = (index, field, value) => {
    const updated = [...passengerDetails]
    updated[index][field] = value
    setPassengerDetails(updated)
  }

  const travellersFromForm = () =>
    passengerDetails.map((p) => {
      const parts = String(p.name || '').trim().split(/\s+/)
      const firstName = parts[0] || 'NA'
      const lastName = parts.slice(1).join(' ') || 'NA'
      return {
        firstName,
        lastName,
        mobile: contactMobile.trim(),
        email: contactEmail.trim() || null,
      }
    })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!contactMobile.trim()) {
      setError('Please add a contact mobile number.')
      return
    }

    try {
      setLoading(true)
      const travellers = travellersFromForm()
      const payload = {
        flightId: flight.id || flight._id,
        date: flight.date || null,
        passengers: travellers.length,
        travellers,
        flight: {
          id: flight.id || null,
          airline: flight.airline || null,
          airlineCode: flight.airlineCode || null,
          flightNumber: flight.flightNumber || null,
          from: flight.from,
          to: flight.to,
          departTime: flight.departTime || null,
          arriveTime: flight.arriveTime || null,
          durationMinutes: flight.durationMinutes ?? null,
          stops: flight.stops ?? 0,
          aircraft: flight.aircraft ?? null,
          price: Math.round(Number(flight.price ?? 0)),
        },
      }
      const res = await createBooking(payload)
      setSuccess(`Booking confirmed. PNR: ${res.pnr}`)
    } catch (err) {
      console.error('Booking error:', err)
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container booking-form" style={{ marginTop: 16 }}>
      <div className="card-custom card-p-4" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800 }}>{flight.from} → {flight.to}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {flight.date && <span className="chip">{flight.date}</span>}
          <span className="chip">{initialPax} pax</span>
        </div>
      </div>

      <div className="booking-grid">
        {/* Passenger card with extra padding via passenger-card class if you added it */}
        <div className="card-custom passenger-card">
          <h2 style={{ marginTop: 0, marginBottom: 12 }}>Passenger details</h2>

          {!!error && <div className="alert-error">{error}</div>}
          {!!success && <div className="alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Contact row */}
            <div className="form-grid-2 form-section">
              <div className="field">
                <label className="form-label-custom">Mobile (required)</label>
                <input
                  type="tel"
                  className="input-field-custom"
                  value={contactMobile}
                  onChange={(e) => setContactMobile(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="form-label-custom">Email (optional)</label>
                <input
                  type="email"
                  className="input-field-custom"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Passenger blocks */}
            {passengerDetails.map((p, i) => (
              <div key={i} className="passenger-block form-section">
                <h4>Passenger {i + 1}</h4>
                <div className="form-grid-2">
                  <div className="field">
                    <label className="form-label-custom">Full name</label>
                    <input
                      type="text"
                      className="input-field-custom"
                      value={p.name}
                      onChange={(e) => handleChange(i, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="form-label-custom">Age</label>
                    <input
                      type="number"
                      className="input-field-custom"
                      value={p.age}
                      onChange={(e) => handleChange(i, 'age', e.target.value)}
                      min="0"
                      max="120"
                      step="1"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>
                <div className="form-grid-2 form-section">
                  <div className="field">
                    <label className="form-label-custom">Gender</label>
                    <select
                      className="input-field-custom"
                      value={p.gender}
                      onChange={(e) => handleChange(i, 'gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="form-label-custom">Seat preference</label>
                    <select
                      className="input-field-custom"
                      value={p.seatPreference}
                      onChange={(e) => handleChange(i, 'seatPreference', e.target.value)}
                    >
                      <option value="">Seat Preference</option>
                      <option value="Window">Window</option>
                      <option value="Aisle">Aisle</option>
                      <option value="Middle">Middle</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="form-actions">
              <button type="button" className="btn btn-soft" onClick={() => window.history.back()}>
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Booking…' : 'Confirm booking'}
              </button>
            </div>
          </form>
        </div>

        <aside className="summary-card">
          <div className="card-custom card-p-6">
            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Trip summary</h3>
            <div className="summary-row" style={{ marginBottom: 8 }}>
              <div>
                <div className="label">Airline</div>
                <div className="value">{flight.airline} {flight.flightNumber}</div>
              </div>
              <div>
                <div className="label">Date</div>
                <div className="value">{flight.date || '—'}</div>
              </div>
              <div>
                <div className="label">Route</div>
                <div className="value">{flight.from} → {flight.to}</div>
              </div>
              <div>
                <div className="label">Time</div>
                <div className="value">{flight.departTime} – {flight.arriveTime}</div>
              </div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '10px 0 12px' }} />
            <div className="summary-row">
              <div>
                <div className="label">Unit price</div>
                <div className="value">₹{unitPrice.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="label">Passengers</div>
                <div className="value">{initialPax}</div>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 6 }}>
                <div className="label">Total</div>
                <div className="price-total">₹{totalPrice.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}