'use client'
import { FormData } from '@/app/page'

interface Props {
  form: FormData
  update: (p: Partial<FormData>) => void
  next: () => void
}

const agents = [
  {
    key: 'cotizador',
    name: 'Agente Cotizador',
    description: 'Automatiza el envío de slips a aseguradoras y compara cotizaciones automáticamente.',
    icon: '📋',
    color: 'border-green-600 bg-green-950/40',
    activeIcon: 'bg-green-600',
  },
  {
    key: 'validador',
    name: 'Agente Validador de Pagos',
    description: 'Monitorea portales de aseguradoras y reporta pagos pendientes, vencidos y realizados.',
    icon: '✅',
    color: 'border-orange-500 bg-orange-950/40',
    activeIcon: 'bg-orange-500',
  },
]

export default function StepAgents({ form, update, next }: Props) {
  const toggle = (key: 'cotizador' | 'validador') => {
    update({ agentes: { ...form.agentes, [key]: !form.agentes[key as keyof typeof form.agentes] } })
  }

  const canContinue = form.agentes.cotizador || form.agentes.validador

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Bienvenido a Handle</h1>
        <p className="text-neutral-400 text-base">¿Qué agentes vas a configurar para esta empresa?</p>
      </div>

      <div className="space-y-4 mb-8">
        {agents.map((agent) => {
          const isSelected = form.agentes[agent.key as keyof typeof form.agentes]
          return (
            <button
              key={agent.key}
              onClick={() => toggle(agent.key as 'cotizador' | 'validador')}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                isSelected ? agent.color : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected ? `${agent.activeIcon} border-transparent` : 'border-neutral-600'
                }`}>
                  {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agent.icon}</span>
                    <span className="font-semibold text-white">{agent.name}</span>
                  </div>
                  <p className="text-neutral-400 text-sm mt-1">{agent.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={next}
        disabled={!canContinue}
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200"
      >
        Continuar →
      </button>
    </div>
  )
}
