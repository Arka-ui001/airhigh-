import { Link, NavLink } from 'react-router-dom'
import { useMemo } from 'react'

function Icon({ name, size = 22, className = '' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', className }
  if (name === 'plane') return <svg {...props}><path d="M17.5 19L22 21l-1.5-4.5M2 12l20-5-2 6-8 2 2 6-3.5-2L6 18l2-8-6-2z"/></svg>
  return null
}

export default function NavBar() {
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])
  const link = 'nav-link-custom'
  const active = 'nav-link-active-custom'

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            <Icon name="plane" className="icon" /> AeroLux
          </Link>

          <div className="nav-links">
            <NavLink to="/" className={({isActive}) => `${link} ${isActive ? active : ''}`}>Home</NavLink>
            <NavLink to={`/results?from=JFK&to=LAX&date=${today}&passengers=1`} className={link}>Flights</NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}