"use client"

import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const { user } = useAuth()
  const [apiTests, setApiTests] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runApiTests = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: User info
      results.userInfo = user

      // Test 2: Teacher profile
      try {
        const teacherRes = await fetch('/api/teachers/me')
        if (teacherRes.ok) {
          results.teacherProfile = await teacherRes.json()
        } else {
          results.teacherError = `${teacherRes.status}: ${teacherRes.statusText}`
        }
      } catch (err) {
        results.teacherError = err
      }

      // Test 3: Courses
      try {
        const coursesRes = await fetch('/api/teachers/courses')
        if (coursesRes.ok) {
          results.courses = await coursesRes.json()
        } else {
          results.coursesError = `${coursesRes.status}: ${coursesRes.statusText}`
        }
      } catch (err) {
        results.coursesError = err
      }

      // Test 4: Debug auth endpoint
      try {
        const debugRes = await fetch('/api/debug/auth')
        if (debugRes.ok) {
          results.debugAuth = await debugRes.json()
        } else {
          results.debugAuthError = `${debugRes.status}: ${debugRes.statusText}`
        }
      } catch (err) {
        results.debugAuthError = err
      }

      // Test 5: Direct Django API test
      try {
        const djangoRes = await fetch('http://127.0.0.1:8000/api/course-availabilities/')
        if (djangoRes.ok) {
          results.djangoApi = await djangoRes.json()
        } else {
          results.djangoError = `${djangoRes.status}: ${djangoRes.statusText}`
        }
      } catch (err) {
        results.djangoError = err
      }

      // Test 6: Test de création d'une disponibilité (seulement pour les professeurs)
      if (results.courses && results.courses.length > 0 && user?.role === 'teacher') {
        const firstCourse = results.courses[0]
        try {
          const createRes = await fetch(`/api/courses/${firstCourse.id}/availabilities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              day_of_week: 0,
              start_time: '09:00',
              end_time: '10:00'
            })
          })
          
          if (createRes.ok) {
            results.createAvailability = await createRes.json()
          } else {
            results.createAvailabilityError = `${createRes.status}: ${await createRes.text()}`
          }
        } catch (err) {
          results.createAvailabilityError = err
        }
      } else if (user?.role !== 'teacher') {
        results.createAvailabilitySkipped = 'Test ignoré - seuls les professeurs peuvent créer des disponibilités'
      }

      setApiTests(results)
    } catch (error) {
      console.error('Error running tests:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-laha-black text-laha-gold-light p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-laha-gold mb-6">Debug API</h1>
        
        <button
          onClick={runApiTests}
          disabled={loading}
          className="bg-laha-gold text-laha-black px-6 py-3 rounded-lg font-medium mb-6 disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Lancer les tests API'}
        </button>

        {Object.keys(apiTests).length > 0 && (
          <div className="space-y-6">
            <div className="bg-laha-black-light/20 rounded-lg p-6 border border-laha-gold-dark/20">
              <h2 className="text-xl font-semibold text-laha-gold mb-4">Résultats des tests</h2>
              <pre className="text-sm text-laha-gold-light/80 whitespace-pre-wrap overflow-auto">
                {JSON.stringify(apiTests, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 bg-laha-black-light/20 rounded-lg p-6 border border-laha-gold-dark/20">
          <h2 className="text-xl font-semibold text-laha-gold mb-4">Instructions de test</h2>
          <div className="text-laha-gold-light/80 space-y-2">
            <p>1. Cliquez sur "Lancer les tests API" pour diagnostiquer les problèmes</p>
            <p>2. Vérifiez si l'utilisateur a un profil Teacher</p>
            <p>3. Vérifiez si les courses existent</p>
            <p>4. Vérifiez la connexion Django</p>
          </div>
        </div>
      </div>
    </div>
  )
}
