import { useCallback, useEffect, useState } from 'react'

// Small localStorage-backed set of favorited item ids, namespaced by key
// (e.g. "scripts"). Kept client-side so a parent can pull "their" few items
// fast without needing a backend round-trip.
export function useFavorites(namespace: string) {
  const storageKey = `favorites:${namespace}`

  const [ids, setIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids))
    } catch {
      // ignore write failures (e.g. private mode)
    }
  }, [storageKey, ids])

  const isFavorite = useCallback((id: number) => ids.includes(id), [ids])

  const toggleFavorite = useCallback((id: number) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  return { ids, isFavorite, toggleFavorite }
}
