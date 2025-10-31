import Hero from '../components/Hero.jsx'
import SearchForm from '../components/SearchForm.jsx'
import WhyChoose from '../components/WhyChoose.jsx'

export default function Home() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Hero />
      <SearchForm />
      <WhyChoose />
    </div>
  )
}