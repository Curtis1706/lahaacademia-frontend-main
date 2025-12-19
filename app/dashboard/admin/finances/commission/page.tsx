"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, DollarSign, Percent, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import AuthGuard from '@/components/auth/AuthGuard'
import logger from '@/lib/logger'

interface CommissionRates {
  default_rate: number // Taux par défaut (10%)
  individual_rate?: number // Taux pour cours individuels
  group_rate?: number // Taux pour cours en groupe
  custom_rates?: Array<{
    teacher_id: string
    teacher_name: string
    rate: number
  }>
}

export default function CommissionSettingsPage() {
  const [rates, setRates] = useState<CommissionRates>({
    default_rate: 10,
    individual_rate: 10,
    group_rate: 10
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchCommissionRates()
  }, [])

  const fetchCommissionRates = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/commission-rates')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement')
      }

      setRates(data)
    } catch (error) {
      logger.error('Error fetching commission rates', error as Error, { context: 'CommissionSettingsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les taux de commission',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/commission-rates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      toast({
        title: '✅ Taux mis à jour',
        description: 'Les taux de commission ont été sauvegardés avec succès',
      })
    } catch (error) {
      logger.error('Error saving commission rates', error as Error, { context: 'CommissionSettingsPage' })
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de sauvegarder',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard requiredRole="admin">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-screen w-full bg-laha-black dark:bg-laha-black">
          <AdminSidebar open={open} setOpen={setOpen} />
          
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Percent className="h-8 w-8 text-laha-blue" />
                  Configuration des Commissions
                </h1>
                <p className="text-gray-400 mt-2">
                  Gérez les taux de commission reversés aux enseignants
                </p>
              </div>

              {/* Info */}
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-semibold mb-1">Comment ça fonctionne ?</p>
                      <p>
                        Lorsqu'un parent paie un cours, LAHA encaisse le montant total.
                        Le pourcentage configuré ci-dessous est reversé à l'enseignant.
                        Exemple : Prix cours = 10,000 FCFA, Commission 10% = 1,000 FCFA pour LAHA, 9,000 FCFA pour l'enseignant.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-laha-blue" />
                </div>
              ) : (
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Taux de Commission</CardTitle>
                    <CardDescription className="text-gray-400">
                      Configurez les pourcentages de commission par défaut
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Taux par défaut */}
                    <div className="space-y-2">
                      <Label htmlFor="default_rate" className="text-white">
                        Taux par défaut (%)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="default_rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rates.default_rate}
                          onChange={(e) => setRates(prev => ({ ...prev, default_rate: parseFloat(e.target.value) || 0 }))}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Badge variant="outline" className="text-laha-blue border-laha-blue">
                          {rates.default_rate}% = {100 - rates.default_rate}% pour l'enseignant
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">
                        Taux appliqué par défaut à tous les enseignants
                      </p>
                    </div>

                    {/* Taux cours individuels */}
                    <div className="space-y-2">
                      <Label htmlFor="individual_rate" className="text-white">
                        Taux cours individuels (%)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="individual_rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rates.individual_rate || rates.default_rate}
                          onChange={(e) => setRates(prev => ({ ...prev, individual_rate: parseFloat(e.target.value) || 0 }))}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Badge variant="outline" className="text-laha-blue border-laha-blue">
                          {rates.individual_rate || rates.default_rate}% commission
                        </Badge>
                      </div>
                    </div>

                    {/* Taux cours en groupe */}
                    <div className="space-y-2">
                      <Label htmlFor="group_rate" className="text-white">
                        Taux cours en groupe (%)
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="group_rate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rates.group_rate || rates.default_rate}
                          onChange={(e) => setRates(prev => ({ ...prev, group_rate: parseFloat(e.target.value) || 0 }))}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Badge variant="outline" className="text-laha-blue border-laha-blue">
                          {rates.group_rate || rates.default_rate}% commission
                        </Badge>
                      </div>
                    </div>

                    {/* Exemple de calcul */}
                    <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-semibold text-white">Exemple de calcul :</p>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Prix cours : <strong>10,000 FCFA</strong></p>
                        <p>Commission LAHA ({rates.default_rate}%) : <strong className="text-laha-blue">{((10000 * rates.default_rate) / 100).toLocaleString()} FCFA</strong></p>
                        <p>Revenu enseignant ({100 - rates.default_rate}%) : <strong className="text-green-500">{((10000 * (100 - rates.default_rate)) / 100).toLocaleString()} FCFA</strong></p>
                      </div>
                    </div>

                    {/* Bouton sauvegarder */}
                    <div className="flex justify-end pt-4 border-t border-gray-800">
                      <Button onClick={handleSave} disabled={saving} className="min-w-[150px]">
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

