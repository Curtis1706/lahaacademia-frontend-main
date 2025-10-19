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
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, GraduationCap, Clock, DollarSign, FileText, Upload, Shield, AlertCircle, CheckCircle, Camera } from 'lucide-react'

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
    hourly_rate: '',
    // Documents requis
    diploma_file: null as File | null,
    criminal_record_file: null as File | null,
    identity_document_file: null as File | null,
    proof_of_address_file: null as File | null,
    profile_photo: null as File | null,
    cv_file: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string}>({})

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [field]: file.name }))
    } else {
      setUploadedFiles(prev => {
        const newFiles = { ...prev }
        delete newFiles[field]
        return newFiles
      })
    }
  }

  const validateDocuments = () => {
    const requiredDocs = [
      'diploma_file',
      'criminal_record_file', 
      'identity_document_file',
      'proof_of_address_file',
      'profile_photo',
      'cv_file'
    ]
    
    const missingDocs = requiredDocs.filter(doc => !formData[doc as keyof typeof formData])
    
    if (missingDocs.length > 0) {
      setError(`Veuillez télécharger tous les documents requis. Documents manquants : ${missingDocs.length}`)
      return false
    }
    
    return true
  }

  const getDocumentStatus = (field: string) => {
    const file = formData[field as keyof typeof formData] as File | null
    return file ? 'uploaded' : 'missing'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (currentStep === 2 && !validateDocuments()) {
      return
    }

    if (currentStep === 1) {
      setCurrentStep(2)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      
      // Ajouter les champs texte
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirm_password' && typeof value === 'string') {
          formDataToSend.append(key, value)
        }
      })

      // Ajouter les fichiers
      const fileFields = [
        'diploma_file', 'criminal_record_file', 'identity_document_file',
        'proof_of_address_file', 'profile_photo', 'cv_file'
      ]
      
      fileFields.forEach(field => {
        const file = formData[field as keyof typeof formData] as File | null
        if (file) {
          formDataToSend.append(field, file)
        }
      })

      const response = await fetch('/api/teachers/register', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (response.ok) {
        // Inscription réussie - connecter automatiquement l'utilisateur
        console.log('✅ Inscription réussie, connexion automatique...')
        
        // Essayer de se connecter automatiquement
        try {
          const loginResponse = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password
            })
          })
          
          if (loginResponse.ok) {
            const loginData = await loginResponse.json()
            console.log('✅ Connexion automatique réussie')
            
            // Rediriger vers le dashboard enseignant (qui affichera la page d'attente)
            router.push('/dashboard/teacher')
          } else {
            console.log('⚠️ Connexion automatique échouée, redirection vers login')
            router.push('/login?message=Inscription réussie - Connectez-vous pour accéder à votre compte')
          }
        } catch (loginError) {
          console.error('❌ Erreur connexion automatique:', loginError)
          router.push('/login?message=Inscription réussie - Connectez-vous pour accéder à votre compte')
        }
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Créer un compte Enseignant</h1>
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
              <span>•</span>
              <span className={currentStep === 3 ? 'text-white' : ''}>Étape 3</span>
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

              <div className="flex justify-end gap-3 pt-4 border-t border-laha-gold-dark/30">
                <button 
                  type="button" 
                  onClick={() => { if (!termsAccepted) return; setError(''); setCurrentStep(2); }} 
                  disabled={!termsAccepted} 
                  className="flex items-center justify-center gap-2 h-12 w-full md:w-auto rounded-lg bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                >
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              </>
              )}

              {currentStep === 2 && (
                <>

              <LabelInputContainer>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-laha-gold" />
                  <Label htmlFor="specialization" className="text-laha-gold-light">Spécialisation *</Label>
                </div>
                <Select value={formData.specialization} onValueChange={value => setFormData({...formData, specialization: value})}>
                  <SelectTrigger className="bg-laha-black/60 border-laha-gold-dark/30 text-laha-gold-light focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold backdrop-blur-sm h-12">
                    <SelectValue placeholder="Choisir votre spécialisation" />
                  </SelectTrigger>
                  <SelectContent className="bg-laha-black/90 border-laha-gold-dark/30 backdrop-blur-md">
                    <SelectItem value="mathematics" className="text-laha-gold-light focus:bg-laha-gold/20">Mathématiques</SelectItem>
                    <SelectItem value="physics" className="text-laha-gold-light focus:bg-laha-gold/20">Physique</SelectItem>
                    <SelectItem value="chemistry" className="text-laha-gold-light focus:bg-laha-gold/20">Chimie</SelectItem>
                    <SelectItem value="biology" className="text-laha-gold-light focus:bg-laha-gold/20">Biologie</SelectItem>
                    <SelectItem value="french" className="text-laha-gold-light focus:bg-laha-gold/20">Français</SelectItem>
                    <SelectItem value="english" className="text-laha-gold-light focus:bg-laha-gold/20">Anglais</SelectItem>
                    <SelectItem value="history" className="text-laha-gold-light focus:bg-laha-gold/20">Histoire</SelectItem>
                    <SelectItem value="geography" className="text-laha-gold-light focus:bg-laha-gold/20">Géographie</SelectItem>
                  </SelectContent>
                </Select>
              </LabelInputContainer>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-laha-gold" />
                    <Label htmlFor="experience_years" className="text-laha-gold-light">Années d'expérience</Label>
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={e => setFormData({...formData, experience_years: e.target.value})}
                      className="bg-laha-black/60 border-laha-gold-dark/30 text-laha-gold-light pl-10 focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold backdrop-blur-sm h-12"
                      placeholder="4"
                    />
                  </div>
                </LabelInputContainer>
                <LabelInputContainer>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-laha-gold" />
                    <Label htmlFor="hourly_rate" className="text-laha-gold-light">Tarif horaire (FCFA)</Label>
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-laha-gold-light/50" />
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      value={formData.hourly_rate}
                      onChange={e => setFormData({...formData, hourly_rate: e.target.value})}
                      className="bg-laha-black/60 border-laha-gold-dark/30 text-laha-gold-light pl-10 focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold backdrop-blur-sm h-12"
                      placeholder="10000"
                    />
                  </div>
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-laha-gold" />
                  <Label htmlFor="bio" className="text-laha-gold-light">Biographie</Label>
                </div>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="bg-laha-black/60 border-laha-gold-dark/30 text-laha-gold-light focus:ring-2 focus:ring-laha-gold/50 focus:border-laha-gold backdrop-blur-sm resize-none"
                  placeholder="Je suis bon"
                  rows={4}
                />
              </LabelInputContainer>

              <div className="flex flex-col md:flex-row gap-4 md:justify-between pt-4 border-t border-laha-gold-dark/30">
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(1)} 
                  className="flex items-center justify-center gap-2 h-12 w-full md:w-auto rounded-lg border border-laha-gold-dark/30 px-6 text-laha-gold-light/90 hover:bg-laha-gold/10 hover:border-laha-gold/50 transition-all backdrop-blur-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => { setError(''); setCurrentStep(3); }}
                  className="flex items-center justify-center gap-2 h-12 w-full md:w-auto rounded-lg bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              </>
              )}

              {currentStep === 3 && (
                <>
                  {/* Section Documents Requis */}
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-blue-400">Documents de Validation</h3>
                    </div>
                    <p className="text-blue-300/80 text-sm">
                      Tous les documents suivants sont obligatoires pour valider votre compte enseignant. 
                      Votre compte sera activé après vérification par notre équipe.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Diplôme */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">Diplôme Certifié *</Label>
                        {getDocumentStatus('diploma_file') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('diploma_file') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="diploma_file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('diploma_file', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.diploma_file || 'Télécharger votre diplôme'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">PDF, JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Casier Judiciaire */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">Casier Judiciaire *</Label>
                        {getDocumentStatus('criminal_record_file') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('criminal_record_file') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="criminal_record_file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('criminal_record_file', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.criminal_record_file || 'Télécharger votre casier'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">PDF, JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Pièce d'Identité */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">Pièce d'Identité *</Label>
                        {getDocumentStatus('identity_document_file') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('identity_document_file') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="identity_document_file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('identity_document_file', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.identity_document_file || 'Télécharger votre CNI/Passeport'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">PDF, JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Justificatif de Domicile */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">Justificatif de Domicile *</Label>
                        {getDocumentStatus('proof_of_address_file') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('proof_of_address_file') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="proof_of_address_file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('proof_of_address_file', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.proof_of_address_file || 'Télécharger votre justificatif'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">PDF, JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Photo de Profil */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Camera className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">Photo de Profil *</Label>
                        {getDocumentStatus('profile_photo') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('profile_photo') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="profile_photo"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload('profile_photo', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.profile_photo || 'Télécharger votre photo'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">JPG, PNG (max 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* CV */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-laha-gold" />
                        <Label className="text-laha-gold-light font-medium">CV Professionnel *</Label>
                        {getDocumentStatus('cv_file') === 'uploaded' && <CheckCircle className="h-4 w-4 text-green-400" />}
                        {getDocumentStatus('cv_file') === 'missing' && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="cv_file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('cv_file', e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="border-2 border-dashed border-laha-gold-dark/30 rounded-lg p-4 text-center hover:border-laha-gold/50 transition-colors">
                          <Upload className="h-8 w-8 text-laha-gold-light/50 mx-auto mb-2" />
                          <p className="text-sm text-laha-gold-light">
                            {uploadedFiles.cv_file || 'Télécharger votre CV'}
                          </p>
                          <p className="text-xs text-laha-gold-light/60 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Résumé des documents */}
                  <div className="mt-6 p-4 bg-laha-black/40 rounded-lg">
                    <h4 className="text-laha-gold-light font-medium mb-2">Résumé des Documents</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('diploma_file') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('diploma_file') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          Diplôme
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('criminal_record_file') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('criminal_record_file') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          Casier judiciaire
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('identity_document_file') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('identity_document_file') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          Pièce d'identité
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('proof_of_address_file') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('proof_of_address_file') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          Justificatif domicile
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('profile_photo') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('profile_photo') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          Photo de profil
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getDocumentStatus('cv_file') === 'uploaded' ? 
                          <CheckCircle className="h-4 w-4 text-green-400" /> : 
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        }
                        <span className={getDocumentStatus('cv_file') === 'uploaded' ? 'text-green-400' : 'text-red-400'}>
                          CV
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:justify-between pt-4 border-t border-laha-gold-dark/30">
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(2)} 
                      className="flex items-center justify-center gap-2 h-12 w-full md:w-auto rounded-lg border border-laha-gold-dark/30 px-6 text-laha-gold-light/90 hover:bg-laha-gold/10 hover:border-laha-gold/50 transition-all backdrop-blur-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Retour
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 h-12 w-full md:w-auto rounded-lg bg-gradient-to-r from-laha-gold to-laha-gold-dark hover:from-laha-gold-dark hover:to-laha-gold text-laha-black font-semibold px-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-laha-black"></div>
                          Inscription en cours...
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          Créer mon compte
                        </>
                      )}
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