export default function SortBar({ sort, onChange }) {
  return (
    <div className="card-custom card-p-4 sortbar">
      <div>
        <label style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Sort By</label>
        <select className="input-field-custom" style={{ padding: '8px 12px', width: 200 }} value={sort.key} onChange={e => onChange({ ...sort, key: e.target.value })}>
          <option value="price">Sort by: Price</option>
          <option value="duration">Sort by: Duration</option>
          <option value="departure">Sort by: Departure</option>
        </select>
      </div>
      <button className="btn-custom btn-secondary-custom" onClick={() => onChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}>
        {sort.order === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
      </button>
    </div>
  )
}