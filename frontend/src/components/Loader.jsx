export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="card-custom card-p-6" style={{ textAlign: 'center' }}>
      <div className="spinner"></div>
      <div style={{ marginTop: 8, fontSize: 14, color: '#4b5563' }}>{label}</div>
    </div>
  )
}