import { Link } from 'react-router-dom'

export default function EmptyState({ message = 'No flights found.' }) {
  return (
    <div className="card-custom card-p-8" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>🛫</div>
      <div style={{ color: '#374151', marginBottom: 12 }}>{message}</div>
      <Link to="/" className="btn-custom btn-secondary-custom">Change search</Link>
    </div>
  )
}