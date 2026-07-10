import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export interface Article {
  id: number
  title: string
  content: string
  summary: string | null
  category: string | null
  age_group: string | null
  author: string | null
  key_takeaways: string | null
  further_reading: string | null
  sort_order: number
  active: number
}

export interface ArticleCategory {
  name: string
  slug: string
  description: string
  articles: Article[]
}

// Descriptions and ordering for known categories. Articles whose category is
// not listed here still appear (grouped by their category name) so admins can
// add new categories without a code change.
const CATEGORY_META: { name: string; description: string }[] = [
  { name: 'Regulation & Brain', description: 'How the nervous system drives behavior, and why regulation must come before reason.' },
  { name: 'Behavior & Accountability', description: 'Understanding the skills and survival strategies beneath hard behavior.' },
  { name: 'Attachment', description: 'Protest, repair, and building safety after loss and multiple placements.' },
  { name: 'School & System Stress', description: 'Navigating school refusal, visits, and overlapping conditions like ADHD and trauma.' },
  { name: 'Caregiver Strength', description: 'Your own regulation, co-regulation, and preventing burnout.' },
]

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function readingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function splitLines(value: string | null): string[] {
  if (!value) return []
  return value.split('\n').map((l) => l.trim()).filter(Boolean)
}

export function groupByCategory(articles: Article[]): ArticleCategory[] {
  const active = articles
    .filter((a) => a.active)
    .sort((a, b) => a.sort_order - b.sort_order)

  const byName = new Map<string, Article[]>()
  for (const a of active) {
    const name = a.category || 'Uncategorized'
    if (!byName.has(name)) byName.set(name, [])
    byName.get(name)!.push(a)
  }

  const ordered: ArticleCategory[] = []
  const seen = new Set<string>()
  for (const meta of CATEGORY_META) {
    const arts = byName.get(meta.name)
    if (arts && arts.length) {
      ordered.push({ name: meta.name, slug: slugify(meta.name), description: meta.description, articles: arts })
      seen.add(meta.name)
    }
  }
  // Any categories not in the known list, appended in first-seen order.
  for (const [name, arts] of byName) {
    if (!seen.has(name)) {
      ordered.push({ name, slug: slugify(name), description: '', articles: arts })
    }
  }
  return ordered
}

export function useArticles() {
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/content/articles`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Article[]) => setCategories(groupByCategory(data)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading }
}
