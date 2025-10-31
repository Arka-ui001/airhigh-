import data from './india-flights.json'

// Simple seeded random for stable jitters
function seededRandom(seedStr) {
  let h = 0
  for (let i = 0; i < seedStr.length; i++) h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0
  h ^= h << 13; h ^= h >>> 17; h ^= h << 5
  return Math.abs(h % 1000) / 1000
}

export default async function searchFlightsMock({ from, to, date }) {
  const F = (from || '').toUpperCase().trim()
  const T = (to || '').toUpperCase().trim()

  let flights = data.filter(f => f.from === F && f.to === T)

  // Help during testing: partial match if exact not found (first 2 letters)
  if (flights.length === 0 && F.length >= 2 && T.length >= 2) {
    flights = data.filter(f => f.from.startsWith(F.slice(0,2)) && f.to.startsWith(T.slice(0,2)))
  }

  // Price jitter so it feels dynamic; changes every 30 minutes
  const bucket = Math.floor(Date.now() / (1000 * 60 * 30))
  flights = flights.map(f => {
    const seed = `${f.id}-${F}-${T}-${date || 'any'}-${bucket}`
    const jitter = Math.round((seededRandom(seed) - 0.5) * 800) // +/- up to ₹400
    const price = Math.max(999, f.basePrice + jitter)
    return { ...f, price, date: date || new Date().toISOString().slice(0,10) }
  })

  await new Promise(r => setTimeout(r, 300))
  return flights
}