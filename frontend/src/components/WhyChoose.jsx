export default function WhyChoose() {
  return (
    <section className="container why-wrap">
      <h3 className="why-title">Why Choose AeroLux?</h3>
      <div className="why-grid">
        {[
          { title: 'Best Price Guarantee', text: 'Find the most competitive fares for your journey.', icon: <path d="M8 21l4-9 4 9M2 9l10-5 10 5-10 5-10-5z" /> },
          { title: 'Secure Booking', text: 'Your data is safe with our advanced security measures.', icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></> },
          { title: '24/7 Support', text: 'Our team is always here to help you with any queries.', icon: <><path d="M3 10a6 6 0 0 1 12 0v6"/><path d="M21 19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2"/></> },
        ].map((c, i) => (
          <div key={i} className="why-card">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">{c.icon}</svg>
            <div className="why-title-sm">{c.title}</div>
            <div className="why-text">{c.text}</div>
          </div>
        ))}
      </div>
    </section>
  )
}