import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import BookingForm from './pages/BookingForm.jsx'  // <-- added
import './index.css'

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container" style={{ padding: '24px 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/booking" element={<BookingForm />} />  {/* <-- added */}
        </Routes>
      </main>
      <footer className="footer">
        <div className="container" style={{ fontSize: 14 }}>
          © {new Date().getFullYear()} AeroLux. All rights reserved.
        </div>
      </footer>
    </div>
  )
}