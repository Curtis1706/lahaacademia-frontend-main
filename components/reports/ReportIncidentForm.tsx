"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AlertTriangle, Loader2, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logger from '@/lib/logger'

interface ReportIncidentFormProps {
  teacherId: string
  teacherName?: string
  bookingId?: string
  trigger?: React.ReactNode
}

export default function ReportIncidentForm({
  teacherId,
  teacherName,
  bookingId,
  trigger
}: ReportIncidentFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    incident_type: '',
    severity: '',
    description: '',
    evidence: [] as string[]
  })

  const incidentTypes = [
    { value: 'absence', label: 'Absence non justifiée' },
    { value: 'late', label: 'Retard répété' },
    { value: 'behavior', label: 'Comportement inapproprié' },
    { value: 'content', label: 'Contenu inapproprié' },
    { value: 'quality', label: 'Qualité du cours' },
    { value: 'technical', label: 'Problèmes techniques' },
    { value: 'other', label: 'Autre' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Faible', color: 'text-blue-600' },
    { value: 'medium', label: 'Moyen', color: 'text-yellow-600' },
    { value: 'high', label: 'Élevé', color: 'text-orange-600' },
    { value: 'critical', label: 'Critique', color: 'text-red-600' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          booking_id: bookingId || null,
          incident_type: formData.incident_type,
          severity: formData.severity,
          description: formData.description,
          evidence: formData.evidence,
          metadata: {
            reported_at: new Date().toISOString(),
            teacher_name: teacherName
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du signalement')
      }

      logger.info('Incident report submitted', { report_id: data.id }, { context: 'ReportIncidentForm' })

      toast({
        title: '✅ Signalement envoyé',
        description: 'Votre signalement a été transmis à notre équipe. Nous traiterons ce cas dans les plus brefs délais.',
        duration: 5000,
      })

      // Réinitialiser le formulaire
      setFormData({
        incident_type: '',
        severity: '',
        description: '',
        evidence: []
      })
      setOpen(false)
    } catch (error) {
      logger.error('Error submitting report', error as Error, { context: 'ReportIncidentForm' })
      toast({
        variant: 'destructive',
        title: '❌ Erreur',
        description: error instanceof Error ? error.message : 'Impossible de soumettre le signalement',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // TODO: Implémenter l'upload de fichiers vers un service de stockage
    // Pour l'instant, on simule juste l'ajout
    const newEvidence = Array.from(files).map(file => file.name)
    setFormData(prev => ({
      ...prev,
      evidence: [...prev.evidence, ...newEvidence]
    }))

    toast({
      title: 'Fichiers ajoutés',
      description: `${files.length} fichier(s) ajouté(s) comme preuve`,
    })
  }

  const removeEvidence = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Signaler un incident
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Signaler un incident
          </DialogTitle>
          <DialogDescription>
            {teacherName ? (
              <>Signaler un problème concernant <strong>{teacherName}</strong></>
            ) : (
              <>Décrivez le problème rencontré avec cet enseignant</>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Type d'incident */}
          <div className="space-y-2">
            <Label htmlFor="incident_type">
              Type d'incident <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.incident_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, incident_type: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type d'incident" />
              </SelectTrigger>
              <SelectContent>
                {incidentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Niveau de gravité */}
          <div className="space-y-2">
            <Label htmlFor="severity">
              Gravité <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le niveau de gravité" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map(level => (
                  <SelectItem key={level.value} value={level.value}>
                    <span className={level.color}>{level.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description détaillée <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez l'incident de manière détaillée : date, heure, contexte, ce qui s'est passé..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 caractères. Soyez aussi précis que possible.
            </p>
          </div>

          {/* Preuves */}
          <div className="space-y-2">
            <Label htmlFor="evidence">
              Preuves (captures d'écran, enregistrements)
            </Label>
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                id="evidence"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="evidence"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Cliquez pour ajouter des fichiers
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images ou PDF (max 10 MB par fichier)
                </p>
              </label>
            </div>

            {/* Liste des preuves ajoutées */}
            {formData.evidence.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.evidence.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <span className="text-sm truncate flex-1">{file}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvidence(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Important :</strong> Les signalements abusifs ou mensongers peuvent entraîner
              des sanctions. Assurez-vous que les informations fournies sont exactes.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.incident_type || !formData.severity || formData.description.length < 50}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Envoyer le signalement'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

