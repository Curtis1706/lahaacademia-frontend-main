'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Smartphone, Shield } from 'lucide-react'

export default function LoginOTPPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const sendOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send_otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('otp')
        setCountdown(300) // 5 minutes
        startCountdown()
      } else {
        setError(data.error || 'Erreur lors de l\'envoi du code')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify_otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp_code: otpCode })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      } else {
        setError(data.error || 'Code OTP invalide')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-laha-black via-laha-black-light to-laha-black flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-laha-black-light/50 backdrop-blur-sm rounded-2xl border border-laha-gold-dark/30 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-laha-gold to-laha-gold-warm rounded-full mb-4">
              {step === 'phone' ? <Smartphone className="h-8 w-8 text-laha-black" /> : <Shield className="h-8 w-8 text-laha-black" />}
            </div>
            <h1 className="text-2xl font-bold text-laha-gold">
              {step === 'phone' ? 'Connexion sécurisée' : 'Code de vérification'}
            </h1>
            <p className="text-laha-gold-light mt-2">
              {step === 'phone' 
                ? 'Entrez votre numéro de téléphone' 
                : `Code envoyé au ${phone}`}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <div className="space-y-6">
              <Input
                type="tel"
                placeholder="Numéro de téléphone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light"
              />
              <Button
                onClick={sendOTP}
                disabled={loading || !phone}
                className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le code'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                type="text"
                placeholder="Code à 6 chiffres"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                maxLength={6}
                className="bg-laha-black-light/30 border-laha-gold-dark/30 text-laha-gold-light text-center text-2xl tracking-widest"
              />
              
              {countdown > 0 && (
                <p className="text-laha-gold-light text-center text-sm">
                  Code valide pendant {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </p>
              )}

              <Button
                onClick={verifyOTP}
                disabled={loading || otpCode.length !== 6}
                className="w-full bg-gradient-to-r from-laha-gold to-laha-gold-warm text-laha-black font-semibold"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep('phone')}
                className="w-full text-laha-gold-light hover:text-laha-gold"
              >
                Modifier le numéro
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}