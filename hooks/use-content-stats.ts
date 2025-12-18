"use client"

import { useState, useEffect } from "react"
import logger from "@/lib/logger"

interface ContentStats {
  courses: number
  qcms: number
  books: number
  videos: number
  documents: number
  loading: boolean
  error: string | null
}

export function useContentStats() {
  const [stats, setStats] = useState<ContentStats>({
    courses: 0,
    qcms: 0,
    books: 0,
    videos: 0,
    documents: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }))
        
        const baseApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        
        // Récupérer les statistiques de chaque section en parallèle
        const [coursesRes, qcmsRes, booksRes, videosRes, documentsRes] = await Promise.allSettled([
          fetch(`${baseApi}/api/admin/courses/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('adminToken') || 'cee5456080015db2299344035fecdb5936469663'}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${baseApi}/api/admin/qcm/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('adminToken') || 'cee5456080015db2299344035fecdb5936469663'}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${baseApi}/api/admin/books/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('adminToken') || 'cee5456080015db2299344035fecdb5936469663'}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${baseApi}/api/admin/videos/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('adminToken') || 'cee5456080015db2299344035fecdb5936469663'}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${baseApi}/api/admin/documents/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('adminToken') || 'cee5456080015db2299344035fecdb5936469663'}`,
              'Content-Type': 'application/json'
            }
          })
        ])

        const newStats: ContentStats = {
          courses: 0,
          qcms: 0,
          books: 0,
          videos: 0,
          documents: 0,
          loading: false,
          error: null
        }

        // Traiter les réponses
        if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
          const coursesData = await coursesRes.value.json()
          newStats.courses = Array.isArray(coursesData) ? coursesData.length : coursesData.count || 0
        }

        if (qcmsRes.status === 'fulfilled' && qcmsRes.value.ok) {
          const qcmsData = await qcmsRes.value.json()
          newStats.qcms = Array.isArray(qcmsData) ? qcmsData.length : qcmsData.count || 0
        }

        if (booksRes.status === 'fulfilled' && booksRes.value.ok) {
          const booksData = await booksRes.value.json()
          newStats.books = Array.isArray(booksData) ? booksData.length : booksData.count || 0
        }

        if (videosRes.status === 'fulfilled' && videosRes.value.ok) {
          const videosData = await videosRes.value.json()
          newStats.videos = Array.isArray(videosData) ? videosData.length : videosData.count || 0
        }

        if (documentsRes.status === 'fulfilled' && documentsRes.value.ok) {
          const documentsData = await documentsRes.value.json()
          newStats.documents = Array.isArray(documentsData) ? documentsData.length : documentsData.count || 0
        }

        setStats(newStats)

      } catch (error) {
        logger.error('Error fetching content stats', error as Error, { context: 'useContentStats' })
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Erreur lors du chargement des données'
        }))
      }
    }

    fetchStats()
  }, [])

  return stats
}
