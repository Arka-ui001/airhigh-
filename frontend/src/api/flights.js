import api from './client.js'
import searchFlightsMock from '../mock/searchFlightsMock.js'

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

async function searchFlights(params) {
  if (USE_MOCK) {
    return searchFlightsMock(params)
  }
  const res = await api.get('/flights/search', { params })
  return res.data
}

// Export both ways so any import style works
export { searchFlights }
export default searchFlights