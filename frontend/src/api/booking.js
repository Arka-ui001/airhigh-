export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Booking failed ${res.status}: ${text}`)
  }
  return res.json()
}

export async function getBookingByPNR(pnr) {
  const res = await fetch(`${API_BASE}/bookings/pnr/${encodeURIComponent(pnr)}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Fetch booking failed ${res.status}: ${text}`)
  }
  return res.json()
}