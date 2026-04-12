'use client'
import { useState } from 'react'
import StepAgents from '@/components/steps/StepAgents'
import StepCompany from '@/components/steps/StepCompany'
import StepTeam from '@/components/steps/StepTeam'
import StepCotizador from '@/components/steps/StepCotizador'
import StepValidador from '@/components/steps/StepValidador'
import StepSuccess from '@/components/steps/StepSuccess'

export type Ramo = 'Daños' | 'Flotillas' | 'Autos' | 'GMM' | 'Vida' | 'RC' | 'Transporte' | 'Marítimo' | 'Incendio' | 'Fianzas' | 'Cyber' | 'Otro'

export interface Aseguradora {
  nombre: string
  ramos: Ramo[]
  correos: string[]
}

export interface PortalAuto {
  aseguradora: string
  url: string
  usuario: string
  contrasena: string
  prioridad: string
}

export interface AseguradoraValidador {
  nombre: string
  usuario: string
  contrasena: string
  prioridad: string
}

export interface Usuario {
  nombre: string
  correo: string
  enviaCotizaciones: boolean
  accesoPortal: boolean
}

export interface DestinatarioReporte {
  nombre: string
  correo: string
  recibeReporte: boolean
  accesoPortal: boolean
}

export interface FormData {
  // Empresa
  empresa: string
  dominio: string
  emailPrefix: string
  // Agentes seleccionados
  agentes: {
    cotizador: boolean
    validador: boolean
  }
  // Equipo
  usuarios: Usuario[]
  // Cotizador
  aseguradoras: Aseguradora[]
  portalesAuto: PortalAuto[]
  // Validador
  aseguradorasValidador: AseguradoraValidador[]
  destinatariosReporte: DestinatarioReporte[]
  frecuenciaMonitoreo: 'diaria' | 'semanal' | ''
  formatoReporte: ('excel' | 'correo' | 'dashboard')[]
  alertasPagosVencidos: boolean | null
}

const initialForm: FormData = {
  empresa: '',
  dominio: '',
  emailPrefix: '',
  agentes: { cotizador: false, validador: false },
  usuarios: [{ nombre: '', correo: '', enviaCotizaciones: true, accesoPortal: true }],
  aseguradoras: [{ nombre: '', ramos: [], correos: [''] }],
  portalesAuto: [],
  aseguradorasValidador: [{ nombre: '', usuario: '', contrasena: '', prioridad: '' }],
  destinatariosReporte: [{ nombre: '', correo: '', recibeReporte: true, accesoPortal: true }],
  frecuenciaMonitoreo: '',
  formatoReporte: [],
  alertasPagosVencidos: null,
}

const STEPS = ['Agentes', 'Empresa', 'Equipo', 'Cotizador', 'Validador', 'Listo']

export default function Home() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const visibleSteps = STEPS.filter((s) => {
    if (s === 'Cotizador' && !form.agentes.cotizador) return false
    if (s === 'Validador' && !form.agentes.validador) return false
    return true
  })

  const totalSteps = visibleSteps.length
  const currentLabel = visibleSteps[step] ?? 'Listo'

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))
  const update = (partial: Partial<FormData>) => setForm((f) => ({ ...f, ...partial }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar')
      next() // Go to success step
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentLabel) {
      case 'Agentes': return <StepAgents form={form} update={update} next={next} />
      case 'Empresa': return <StepCompany form={form} update={update} next={next} prev={prev} />
      case 'Equipo': return <StepTeam form={form} update={update} next={next} prev={prev} />
      case 'Cotizador': return <StepCotizador form={form} update={update} next={next} prev={prev} />
      case 'Validador': return <StepValidador form={form} update={update} prev={prev} onSubmit={handleSubmit} loading={loading} error={error} />
      case 'Listo': return <StepSuccess form={form} />
      default: return null
    }
  }

  // If no validador but on last data step, show submit
  const isLastDataStep = currentLabel === 'Equipo' && !form.agentes.cotizador && !form.agentes.validador
  const isCotizadorLast = currentLabel === 'Cotizador' && !form.agentes.validador

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 py-4 flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M4 8 L16 4 L28 8 L28 24 L16 28 L4 24 Z" fill="#16a34a" opacity="0.9"/>
          <path d="M16 4 L28 8 L28 24 L16 28 Z" fill="#15803d"/>
          <path d="M10 14 L16 12 L22 14 L22 20 L16 22 L10 20 Z" fill="white" opacity="0.9"/>
        </svg>
        <span className="font-semibold text-white text-lg tracking-tight">handle</span>
        <span className="text-neutral-500 text-sm ml-2">/ Onboarding</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {currentLabel !== 'Listo' && (
          <div className="w-full max-w-2xl mb-8">
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-3">
              {visibleSteps.slice(0, -1).map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border transition-all ${
                    i < step ? 'bg-green-600 border-green-600 text-white' :
                    i === step ? 'bg-white border-white text-black' :
                    'border-neutral-700 text-neutral-500'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : i < step ? 'text-green-500' : 'text-neutral-500'}`}>
                    {label}
                  </span>
                  {i < visibleSteps.length - 2 && (
                    <div className={`flex-1 h-px ${i < step ? 'bg-green-600' : 'bg-neutral-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl">
          {/* Override next/submit for special cases */}
          {(isLastDataStep || isCotizadorLast) ? (
            <div>
              {renderStep()}
              {/* These components handle their own submit via onSubmit prop; pass it */}
            </div>
          ) : (
            renderStep()
          )}
        </div>
      </div>

      <footer className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-600">
        © 2025 Handle · <a href="https://app.handle.run" className="hover:text-neutral-400">app.handle.run</a>
      </footer>
    </div>
  )
}
