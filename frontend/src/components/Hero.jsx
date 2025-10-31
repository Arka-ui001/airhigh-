export default function Hero() {
  return (
    <section className="hero full-bleed">
      <div
        className="hero-bg"
        style={{
          backgroundImage:
            'url(https://raw.githubusercontent.com/farazc60/Project-Images/refs/heads/main/aerolux-hero-section.webp)',
        }}
      >
        {/* no overlay (so image is not faded) */}
        <div className="container hero-pad hero-content">
          <div style={{ maxWidth: 620 }}>
            <h1 className="hero-title">Discover Your Next Adventure</h1>
            <p className="hero-sub">
              Book flights to your dream destinations with AeroLux. Seamless, secure, and swift.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}