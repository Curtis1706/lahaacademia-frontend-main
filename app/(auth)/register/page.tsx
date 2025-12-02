'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BottomGradient, LabelInputContainer } from '@/components/ui/form-utils'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    country: '',
    city: '',
    school_level: '',
    current_grade: '',
    school_name: '',
    referral_code: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const validateStepOne = (): string | null => {
    if (!formData.first_name || !formData.last_name) return 'Veuillez renseigner votre prénom et votre nom.'
    if (!formData.email) return "Veuillez renseigner votre adresse email."
    if (!formData.phone) return "Veuillez renseigner votre numéro de téléphone."
    if (!formData.date_of_birth) return "Veuillez renseigner votre date de naissance."
    if (!formData.country) return "Veuillez renseigner votre pays."
    if (!formData.city) return "Veuillez renseigner votre ville."
    if (!formData.school_level) return "Veuillez sélectionner votre niveau scolaire."
    if (!formData.password || !formData.confirm_password) return 'Veuillez renseigner et confirmer votre mot de passe.'
    if (formData.password !== formData.confirm_password) return 'Les mots de passe ne correspondent pas.'
    if (!termsAccepted) return "Veuillez accepter les conditions d'utilisation."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Inscription réussie')
      } else {
        setError(data.error || 'Erreur lors de l\'inscription')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black-light to-laha-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="shadow-input bg-laha-black-light/50 backdrop-blur-sm rounded-2xl border border-laha-gold-dark/30 p-8">
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-laha-gold">Inscription Élève</h1>
              <p className="text-sm text-laha-gold-light/70 mt-2">Crée ton compte pour accéder aux cours et au suivi personnalisé</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-4">
              <span className={currentStep === 1 ? 'text-white' : ''}>Étape 1</span>
              <span>•</span>
              <span className={currentStep === 2 ? 'text-white' : ''}>Étape 2</span>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <>
              <div>
                <h2 className="text-laha-gold-light/80 text-xs font-semibold uppercase tracking-wider mb-3">Informations personnelles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="first_name" className="text-laha-gold-light">Prénom *</Label>
                  <Input
                      id="first_name"
                      placeholder="Ex: Koffi"
                      value={formData.first_name}
                      onChange={e => setFormData({...formData, first_name: e.target.value})}
                      className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                      required
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="last_name" className="text-laha-gold-light">Nom *</Label>
                    <Input
                      id="last_name"
                      placeholder="Ex: Asante"
                      value={formData.last_name}
                      onChange={e => setFormData({...formData, last_name: e.target.value})}
                      className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                      required
                    />
                  </LabelInputContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-laha-gold-light">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@domaine.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="phone" className="text-laha-gold-light">Téléphone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: +229 90 00 00 00"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    required
                  />
                </LabelInputContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="date_of_birth" className="text-laha-gold-light">Date de naissance *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={e => setFormData({...formData, date_of_birth: e.target.value})}
                    className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="country" className="text-laha-gold-light">Pays *</Label>
                  <Input
                    id="country"
                    placeholder="Ex: Bénin"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    required
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="city" className="text-laha-gold-light">Ville *</Label>
                  <Input
                    id="city"
                    placeholder="Ex: Cotonou"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    required
                  />
                </LabelInputContainer>
              </div>

              <div>
                <h2 className="text-laha-gold-light/80 text-xs font-semibold uppercase tracking-wider mb-3">Parcours scolaire</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label className="text-laha-gold-light">Niveau scolaire *</Label>
                    <Select value={formData.school_level} onValueChange={value => setFormData({...formData, school_level: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-lg focus:ring-2 focus:ring-laha-gold/40">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-laha-black border-laha-gold-dark/30">
                        <SelectItem value="primary" className="text-laha-gold-light">Primaire</SelectItem>
                        <SelectItem value="secondary" className="text-laha-gold-light">Secondaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="current_grade" className="text-laha-gold-light">Classe actuelle</Label>
                    <Input
                      id="current_grade"
                      placeholder="Ex: CM2, 3ème..."
                      value={formData.current_grade}
                      onChange={e => setFormData({...formData, current_grade: e.target.value})}
                      className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                    />
                  </LabelInputContainer>
                </div>
              </div>

              <div>
                <h2 className="text-laha-gold-light/80 text-xs font-semibold uppercase tracking-wider mb-3">Sécurité</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LabelInputContainer>
                    <Label htmlFor="password" className="text-laha-gold-light">Mot de passe *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                      required
                    />
                  </LabelInputContainer>
                  <LabelInputContainer>
                    <Label htmlFor="confirm_password" className="text-laha-gold-light">Confirmer le mot de passe *</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={formData.confirm_password}
                      onChange={e => setFormData({...formData, confirm_password: e.target.value})}
                      className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                      required
                    />
                  </LabelInputContainer>
                </div>
              </div>

              <LabelInputContainer>
                <Label htmlFor="referral_code" className="text-laha-gold-light">Code de parrainage (optionnel)</Label>
                <Input
                  id="referral_code"
                  placeholder="Saisir un code si vous en avez un"
                  value={formData.referral_code}
                  onChange={e => setFormData({...formData, referral_code: e.target.value})}
                  className="bg-white/10 border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent"
                />
              </LabelInputContainer>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <input id="terms" type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/10" />
                <label htmlFor="terms" className="select-none">J'accepte les <a className="text-laha-gold hover:underline" href="/terms">conditions d'utilisation</a> et la <a className="text-laha-gold hover:underline" href="/privacy">politique de confidentialité</a></label>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => {
                  const err = validateStepOne();
                  if (err) { setError(err); return; }
                  setError('');
                  setCurrentStep(2);
                }} disabled={!termsAccepted} className="group/btn relative block h-12 w-full md:w-auto rounded-md bg-gradient-to-br from-black to-neutral-700 px-6 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff20_inset,0px_-1px_0px_0px_#ffffff20_inset] disabled:opacity-60">
                  Continuer
                  <BottomGradient />
                </button>
              </div>
              </>
              )}

              {currentStep === 2 && (
                <>
                {/* Etape 2: Informations complémentaires déjà rendues ci-dessus; on montre seulement les sections non couvertes si besoin */}
                {/* Ici, tout est déjà dans l'étape 1; pour une séparation stricte, on a déplacé le bouton submit ici */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-3 md:justify-between">
                    <button type="button" onClick={() => setCurrentStep(1)} className="h-12 w-full md:w-auto rounded-md border border-white/20 px-6 text-white/90 hover:bg-white/10">Retour</button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="group/btn relative block h-12 w-full md:w-auto rounded-md bg-gradient-to-br from-black to-neutral-700 px-6 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff20_inset,0px_-1px_0px_0px_#ffffff20_inset] disabled:opacity-60"
                    >
                      {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                      <BottomGradient />
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm">
                    <a href="/login" className="text-laha-gold-light/80 hover:text-laha-gold">Déjà inscrit ? Se connecter</a>
                    <a href="/account-type" className="text-laha-gold-light/80 hover:text-laha-gold">Choisir un autre type de compte</a>
                  </div>
                </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


