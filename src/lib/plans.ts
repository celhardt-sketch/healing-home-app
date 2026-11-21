import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export interface PublicPlan {
  id: string
  name: string
  group: string
  amount_display: string
  interval: string
  trial_days: number
  description: string
}

/** What the app shows until the backend confirms another plan can be sold. */
export const CLASSIC_MONTHLY: PublicPlan = {
  id: 'monthly',
  name: 'Monthly',
  group: 'family',
  amount_display: '$9.99',
  interval: 'month',
  trial_days: 0,
  description: 'Full access for your family, billed each month. Cancel anytime.',
}

export function isClassicMonthly(plans: PublicPlan[]): boolean {
  return plans.length === 1 && plans[0].id === 'monthly' && (plans[0].trial_days || 0) === 0
}

export function planIntervalLabel(plan: PublicPlan): string {
  return plan.interval === 'year' ? 'year' : 'month'
}

function isPlan(value: unknown): value is PublicPlan {
  if (!value || typeof value !== 'object') return false
  const plan = value as PublicPlan
  return typeof plan.id === 'string' && typeof plan.name === 'string' && typeof plan.amount_display === 'string'
}

export async function fetchPublicPlans(): Promise<PublicPlan[]> {
  try {
    const res = await fetch(`${API_URL}/api/plans`)
    if (!res.ok) return [CLASSIC_MONTHLY]
    const data = await res.json()
    if (!Array.isArray(data?.plans)) return [CLASSIC_MONTHLY]
    const plans = data.plans.filter(isPlan).map((plan: PublicPlan) => ({
      ...plan,
      trial_days: Number(plan.trial_days) || 0,
      interval: plan.interval || 'month',
      group: plan.group || 'family',
      description: plan.description || '',
    }))
    return plans.length > 0 ? plans : [CLASSIC_MONTHLY]
  } catch {
    return [CLASSIC_MONTHLY]
  }
}

/** Starts as the current monthly offer so a missing endpoint cannot advertise a plan. */
export function usePublicPlans(): PublicPlan[] {
  const [plans, setPlans] = useState<PublicPlan[]>([CLASSIC_MONTHLY])
  useEffect(() => {
    let cancelled = false
    fetchPublicPlans().then((next) => {
      if (!cancelled) setPlans(next)
    })
    return () => {
      cancelled = true
    }
  }, [])
  return plans
}
