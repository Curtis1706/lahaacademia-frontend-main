'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BottomGradient, LabelInputContainer } from '@/components/ui/form-utils'
import Image from 'next/image'
import Link from 'next/link'
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'

export default function RegisterTeacherPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    bio: '',
    specialization: '',
    experience_years: '',
    education_level: '',
    certifications: '',
    hourly_rate: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirm_password') {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch('/api/teachers/register', {
        method: 'POST',
        body: formDataToSend
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
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black to-laha-gold-dark">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Image src="/logo.png" alt="LAHA Editions" width={40} height={40} className="rounded-lg" />
              <span className="font-heading text-2xl font-bold text-laha-gold">LAHAACADEMIA</span>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Créer un compte Professeur</h1>
          <p className="text-white/70 mt-2">Rejoignez la révolution éducative africaine</p>
          <div className="mt-4">
            <Link href="/account-type" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Changer le type de compte
            </Link>
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="relative shadow-input bg-laha-black-light/30 backdrop-blur-md rounded-2xl border border-white/10 p-8">
            <h1 className="text-3xl font-bold text-laha-gold text-center mb-2">
              Inscription Enseignant
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="firstName" className="text-white">Prénom *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="firstName" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                  </div>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastName" className="text-white">Nom *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="lastName" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                  </div>
                </LabelInputContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="email" className="text-white">Adresse email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                  </div>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="phone" className="text-white">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                  </div>
                </LabelInputContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="password" className="text-white">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="confirm_password" className="text-white">Confirmer *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input id="confirm_password" type={showConfirm ? 'text' : 'password'} value={formData.confirm_password} onChange={e => setFormData({...formData, confirm_password: e.target.value})} className="bg-white/10 border-white/20 text-white rounded-lg pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-laha-gold/50 focus:border-transparent" required />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </LabelInputContainer>
              </div>

              <div className="flex items-center gap-3 text-sm text-white/80">
                <input id="terms" type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/10" />
                <label htmlFor="terms" className="select-none">J'accepte les <a className="text-laha-gold hover:underline" href="/terms">conditions d'utilisation</a> et la <a className="text-laha-gold hover:underline" href="/privacy">politique de confidentialité</a></label>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { if (!termsAccepted) return; setError(''); setCurrentStep(2); }} disabled={!termsAccepted} className="group/btn relative block h-12 w-full md:w-auto rounded-md bg-gradient-to-br from-black to-neutral-700 px-6 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff20_inset,0px_-1px_0px_0px_#ffffff20_inset] disabled:opacity-60">
                  Continuer
                  <BottomGradient />
                </button>
              </div>
              </>
              )}

              {currentStep === 2 && (
                <>

              <div>
                <Label htmlFor="specialization" className="text-laha-gold-light">Spécialisation *</Label>
                <Select value={formData.specialization} onValueChange={value => setFormData({...formData, specialization: value})}>
                  <SelectTrigger className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light">
                    <SelectValue placeholder="Choisir votre spécialisation" />
                  </SelectTrigger>
                  <SelectContent className="bg-laha-black border-laha-gold-dark/30">
                    <SelectItem value="mathematics" className="text-laha-gold-light">Mathématiques</SelectItem>
                    <SelectItem value="physics" className="text-laha-gold-light">Physique</SelectItem>
                    <SelectItem value="chemistry" className="text-laha-gold-light">Chimie</SelectItem>
                    <SelectItem value="biology" className="text-laha-gold-light">Biologie</SelectItem>
                    <SelectItem value="french" className="text-laha-gold-light">Français</SelectItem>
                    <SelectItem value="english" className="text-laha-gold-light">Anglais</SelectItem>
                    <SelectItem value="history" className="text-laha-gold-light">Histoire</SelectItem>
                    <SelectItem value="geography" className="text-laha-gold-light">Géographie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience_years" className="text-laha-gold-light">Années d'expérience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={e => setFormData({...formData, experience_years: e.target.value})}
                    className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
                  />
                </div>
                <div>
                  <Label htmlFor="hourly_rate" className="text-laha-gold-light">Tarif horaire (FCFA)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="0"
                    value={formData.hourly_rate}
                    onChange={e => setFormData({...formData, hourly_rate: e.target.value})}
                    className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-laha-gold-light">Biographie</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
                  placeholder="Parlez-nous de votre parcours et de votre approche pédagogique..."
                  rows={4}
                />
              </div>

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
              </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}