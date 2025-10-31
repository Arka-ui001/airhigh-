import { useSearchParams } from 'react-router-dom'

export default function useQueryParams() {
  const [sp] = useSearchParams()
  return {
    from: (sp.get('from') || '').toUpperCase(),
    to: (sp.get('to') || '').toUpperCase(),
    date: sp.get('date') || '',
    passengers: Number(sp.get('passengers') || 1)
  }
}