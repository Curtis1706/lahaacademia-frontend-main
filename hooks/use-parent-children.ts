import { useState, useEffect } from 'react'
import logger from '@/lib/logger'

interface Child {
  id: string
  name: string
  age: number | null
  class_level: string
  subjects: string[]
  avatar?: string | null
  email?: string
  phone?: string
  birth_date: string
  school_name: string
  country: string
  city: string
  school_level: string
  average_score: number
  courses_completed: number
  study_time_total: number
  last_activity: string | null
  is_blocked: boolean
  learning_style: string
  goals: string
  streak_days: number
  total_exams_taken: number
  average_exam_score: number
}

interface Parent {
  id: string
  name: string
  email: string
  phone: string
  occupation: string
  education_level: string
  total_children: number
  total_payments: number
  monitoring_enabled: boolean
  weekly_reports: boolean
  exam_notifications: boolean
}

interface ParentChildrenData {
  children: Child[]
  parent: Parent
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useParentChildren(): ParentChildrenData {
  const [children, setChildren] = useState<Child[]>([])
  const [parent, setParent] = useState<Parent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      logger.debug('Fetching parent children data', {}, { context: 'useParentChildren' })

      const response = await fetch('/api/parent/children', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur réseau' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      logger.debug('Parent children data fetched successfully', { childrenCount: data.children?.length }, { context: 'useParentChildren' })

      setChildren(data.children || [])
      setParent(data.parent || null)
      setError(null)
      
    } catch (err) {
      logger.error('Error fetching parent children', err as Error, { context: 'useParentChildren' })
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setChildren([])
      setParent(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    children,
    parent: parent || {
      id: '',
      name: '',
      email: '',
      phone: '',
      occupation: '',
      education_level: '',
      total_children: 0,
      total_payments: 0,
      monitoring_enabled: true,
      weekly_reports: true,
      exam_notifications: true,
    },
    loading,
    error,
    refetch: fetchData,
  }
}
