'use client'
import { FormData } from '@/app/page'

interface Props {
  form: FormData
  update: (p: Partial<FormData>) => void
  next: () => void
  prev: () => void
}

export default function StepCompany({ form, update, next, prev }: Props) {
  const handleDomain = (value: string) => {
    const clean = value.toLowerCase().replace(/\s/g, '')
    update({ dominio: clean })
    // Auto-suggest email prefix from domain
    const prefix = clean.split('.')[0].replace(/[^a-z0-9]/g, '')
    if (prefix) update({ emailPrefix: prefix })
  }

  const canContinue = form.empresa.trim() && form.dominio.trim() && form.emailPrefix.trim()

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Información de la empresa</h2>
        <p className="text-neutral-400 text-sm">Así identificaremos su cuenta en Handle.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Nombre de la empresa <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.empresa}
            onChange={(e) => update({ empresa: e.target.value })}
            placeholder="Ej: Metrópoli Seguros"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
          <p className="text-xs text-neutral-500 mt-1">Usa el nombre de marca, no la razón social.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Dominio de correo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.dominio}
            onChange={(e) => handleDomain(e.target.value)}
            placeholder="Ej: metropoliseguros.com.mx"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Prefijo del agente <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-0">
            <input
              type="text"
              value={form.emailPrefix}
              onChange={(e) => update({ emailPrefix: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
              placeholder="metropoli"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-l-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
            <div className="bg-neutral-800 border border-l-0 border-neutral-700 rounded-r-lg px-4 py-3 text-neutral-400 text-sm whitespace-nowrap">
              @handle.run
            </div>
          </div>
          {form.emailPrefix && (
            <p className="text-xs text-green-500 mt-1">
              ✓ El agente recibirá correos en: cotizador.{form.emailPrefix}@handle.run
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-1">Minúsculas, sin espacios. No se puede cambiar después.</p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={prev} className="px-5 py-3 rounded-lg border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-900 transition-colors">
          ← Atrás
        </button>
        <button
          onClick={next}
          disabled={!canContinue}
          className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
