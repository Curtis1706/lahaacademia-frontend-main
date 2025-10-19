import { useState, useEffect } from 'react'

interface Child {
  id: string
  name: string
  age: number
  class_level: string
  subjects: string[]
  avatar?: string
  email?: string
  phone?: string
  birth_date: string
  school: string
  emergency_contact: {
    name: string
    phone: string
    relationship: string
  }
  medical_info?: {
    allergies: string[]
    medications: string[]
    conditions: string[]
  }
  learning_preferences: {
    learning_style: string
    preferred_schedule: string[]
    difficulty_level: string
  }
  performance_summary: {
    overall_grade: number
    attendance_rate: number
    courses_enrolled: number
    courses_completed: number
    last_activity: string
  }
  created_at: string
  updated_at: string
}

interface Course {
  id: string
  title: string
  description: string
  subject: string
  class_level: string
  duration: number
  price: number
  teacher: {
    id: string
    name: string
    avatar?: string
    location: string
    country: string
    languages: string[]
    rating: number
    students_count: number
    hourly_rate: number
    subjects: string[]
    class_levels: string[]
    availability: {
      day: string
      start_time: string
      end_time: string
    }[]
    profile: {
      bio: string
      experience: number
      education: string
      certifications: string[]
    }
  }
  schedule: {
    day: string
    start_time: string
    end_time: string
    available_slots: number
  }[]
  max_students: number
  current_students: number
  rating: number
  reviews_count: number
}

interface CourseProgress {
  id: string
  title: string
  subject: string
  teacher: {
    name: string
    avatar?: string
  }
  progress: number
  grade: number
  attendance: number
  last_session: string
  next_session: string
  status: "active" | "completed" | "paused"
  lessons_completed: number
  total_lessons: number
  assignments_pending: number
  upcoming_exams: number
}

interface PerformanceMetric {
  subject: string
  grade: number
  trend: "up" | "down" | "stable"
  improvement: number
  last_exam_score: number
  average_score: number
  rank_in_class?: number
}

interface AttendanceRecord {
  date: string
  course: string
  teacher: string
  status: "present" | "absent" | "late"
  duration: number
  notes?: string
}

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "mobile"
  name: string
  details: string
  is_default: boolean
  is_verified: boolean
  expiry_date?: string
}

interface Transaction {
  id: string
  amount: number
  currency: string
  type: "payment" | "refund" | "credit"
  status: "completed" | "pending" | "failed" | "cancelled"
  description: string
  child_name: string
  course_title: string
  teacher_name: string
  payment_method: string
  transaction_date: string
  due_date?: string
  reference: string
  fees: number
  net_amount: number
}

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: "paid" | "pending" | "overdue" | "cancelled"
  due_date: string
  paid_date?: string
  child_name: string
  course_title: string
  teacher_name: string
  items: {
    description: string
    quantity: number
    unit_price: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  payment_method?: string
  created_at: string
}

interface PaymentSummary {
  total_spent: number
  monthly_spent: number
  pending_payments: number
  upcoming_payments: number
  active_subscriptions: number
  average_monthly_cost: number
}

interface ParentData {
  children: Child[]
  courses: Course[]
  courseProgress: CourseProgress[]
  performanceMetrics: PerformanceMetric[]
  attendanceRecords: AttendanceRecord[]
  paymentMethods: PaymentMethod[]
  transactions: Transaction[]
  invoices: Invoice[]
  paymentSummary: PaymentSummary | null
  loading: boolean
  error: string | null
}

export function useParentData() {
  const [data, setData] = useState<ParentData>({
    children: [],
    courses: [],
    courseProgress: [],
    performanceMetrics: [],
    attendanceRecords: [],
    paymentMethods: [],
    transactions: [],
    invoices: [],
    paymentSummary: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Récupérer le token depuis le localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Token d\'authentification manquant')
        }

        // Récupérer toutes les données en parallèle
        const [childrenResponse, coursesResponse, progressResponse, paymentsResponse] = await Promise.allSettled([
          fetch('/api/parent/children', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/api/parent/courses', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/api/parent/progress', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('/api/parent/payments', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        const children = childrenResponse.status === 'fulfilled' 
          ? await childrenResponse.value.json()
          : { data: [] }
        
        const courses = coursesResponse.status === 'fulfilled' 
          ? await coursesResponse.value.json()
          : { data: [] }
        
        const progress = progressResponse.status === 'fulfilled' 
          ? await progressResponse.value.json()
          : { data: {} }
        
        const payments = paymentsResponse.status === 'fulfilled' 
          ? await paymentsResponse.value.json()
          : { data: {} }

        setData({
          children: children.data || [],
          courses: courses.data || [],
          courseProgress: progress.data?.courseProgress || [],
          performanceMetrics: progress.data?.performanceMetrics || [],
          attendanceRecords: progress.data?.attendanceRecords || [],
          paymentMethods: payments.data?.paymentMethods || [],
          transactions: payments.data?.transactions || [],
          invoices: payments.data?.invoices || [],
          paymentSummary: payments.data?.paymentSummary || null,
          loading: false,
          error: null
        })

      } catch (error) {
        console.error('Erreur lors de la récupération des données parentales:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        }))
      }
    }

    fetchData()
  }, [])

  const updateChild = (childId: string, updates: Partial<Child>) => {
    setData(prev => ({
      ...prev,
      children: prev.children.map(child => 
        child.id === childId ? { ...child, ...updates } : child
      )
    }))
  }

  const addChild = (child: Child) => {
    setData(prev => ({
      ...prev,
      children: [...prev.children, child]
    }))
  }

  const removeChild = (childId: string) => {
    setData(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== childId)
    }))
  }

  const updateCourseProgress = (courseId: string, updates: Partial<CourseProgress>) => {
    setData(prev => ({
      ...prev,
      courseProgress: prev.courseProgress.map(course => 
        course.id === courseId ? { ...course, ...updates } : course
      )
    }))
  }

  const addTransaction = (transaction: Transaction) => {
    setData(prev => ({
      ...prev,
      transactions: [transaction, ...prev.transactions]
    }))
  }

  const updateTransaction = (transactionId: string, updates: Partial<Transaction>) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(transaction => 
        transaction.id === transactionId ? { ...transaction, ...updates } : transaction
      )
    }))
  }

  const addPaymentMethod = (paymentMethod: PaymentMethod) => {
    setData(prev => ({
      ...prev,
      paymentMethods: [...prev.paymentMethods, paymentMethod]
    }))
  }

  const updatePaymentMethod = (paymentMethodId: string, updates: Partial<PaymentMethod>) => {
    setData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(method => 
        method.id === paymentMethodId ? { ...method, ...updates } : method
      )
    }))
  }

  const removePaymentMethod = (paymentMethodId: string) => {
    setData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(method => method.id !== paymentMethodId)
    }))
  }

  const refreshData = () => {
    setData(prev => ({ ...prev, loading: true, error: null }))
    // Re-trigger useEffect
    window.location.reload()
  }

  return {
    ...data,
    updateChild,
    addChild,
    removeChild,
    updateCourseProgress,
    addTransaction,
    updateTransaction,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    refreshData
  }
}
