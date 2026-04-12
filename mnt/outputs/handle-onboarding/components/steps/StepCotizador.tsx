'use client'
import { FormData, Aseguradora, Ramo } from '@/app/page'

interface Props {
  form: FormData
  update: (p: Partial<FormData>) => void
  next: () => void
  prev: () => void
}

const RAMOS: Ramo[] = ['Daños', 'Flotillas', 'Autos', 'GMM', 'Vida', 'RC', 'Transporte', 'Marítimo', 'Incendio', 'Fianzas', 'Cyber', 'Otro']

const emptyAseguradora = (): Aseguradora => ({ nombre: '', ramos: [], correos: [''] })

export default function StepCotizador({ form, update, next, prev }: Props) {
  const aseguradoras = form.aseguradoras

  const updateAseg = (i: number, partial: Partial<Aseguradora>) => {
    const updated = aseguradoras.map((a, idx) => idx === i ? { ...a, ...partial } : a)
    update({ aseguradoras: updated })
  }

  const toggleRamo = (i: number, ramo: Ramo) => {
    const current = aseguradoras[i].ramos
    const next = current.includes(ramo) ? current.filter(r => r !== ramo) : [...current, ramo]
    updateAseg(i, { ramos: next })
  }

  const updateCorreo = (i: number, j: number, val: string) => {
    const correos = [...aseguradoras[i].correos]
    correos[j] = val
    updateAseg(i, { correos })
  }

  const addCorreo = (i: number) => updateAseg(i, { correos: [...aseguradoras[i].correos, ''] })
  const removeCorreo = (i: number, j: number) => updateAseg(i, { correos: aseguradoras[i].correos.filter((_, idx) => idx !== j) })

  const addAseg = () => update({ aseguradoras: [...aseguradoras, emptyAseguradora()] })
  const removeAseg = (i: number) => update({ aseguradoras: aseguradoras.filter((_, idx) => idx !== i) })

  const canContinue = aseguradoras.some(a => a.nombre.trim())

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-green-950/60 border border-green-800 rounded-full px-3 py-1 text-xs text-green-400 font-medium mb-3">
          📋 Agente Cotizador
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Aseguradoras</h2>
        <p className="text-neutral-400 text-sm">¿Con qué aseguradoras cotizan y qué ramos manejan?</p>
      </div>

      <div className="space-y-5 mb-4 max-h-[55vh] overflow-y-auto pr-1">
        {aseguradoras.map((aseg, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-neutral-500 font-medium">ASEGURADORA {i + 1}</span>
              {aseguradoras.length > 1 && (
                <button onClick={() => removeAseg(i)} className="text-neutral-600 hover:text-red-400 text-xs transition-colors">✕ Eliminar</button>
              )}
            </div>

            {/* Nombre */}
            <input
              type="text"
              value={aseg.nombre}
              onChange={(e) => updateAseg(i, { nombre: e.target.value })}
              placeholder="Nombre de la aseguradora (Ej: HDI, GNP, Chubb)"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white mb-3"
            />

            {/* Ramos */}
            <div className="mb-3">
              <p className="text-xs text-neutral-500 mb-2 font-medium">RAMOS QUE COTIZA</p>
              <div className="flex flex-wrap gap-2">
                {RAMOS.map((ramo) => (
                  <button
                    key={ramo}
                    onClick={() => toggleRamo(i, ramo)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      aseg.ramos.includes(ramo)
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-neutral-700 text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {ramo}
                  </button>
                ))}
              </div>
            </div>

            {/* Correos */}
            <div>
              <p className="text-xs text-neutral-500 mb-2 font-medium">CORREOS DE COTIZACIÓN</p>
              <div className="space-y-2">
                {aseg.correos.map((correo, j) => (
                  <div key={j} className="flex gap-2">
                    <input
                      type="email"
                      value={correo}
                      onChange={(e) => updateCorreo(i, j, e.target.value)}
                      placeholder={`correo@aseguradora.com${j > 0 ? ' (adicional)' : ''}`}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                    />
                    {aseg.correos.length > 1 && (
                      <button onClick={() => removeCorreo(i, j)} className="text-neutral-600 hover:text-red-400 text-xs px-2">✕</button>
                    )}
                  </div>
                ))}
                {aseg.correos.length < 5 && (
                  <button onClick={() => addCorreo(i)} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                    + Agregar correo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addAseg} className="w-full py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors mb-6">
        + Agregar aseguradora
      </button>

      <div className="flex gap-3">
        <button onClick={prev} className="px-5 py-3 rounded-lg border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-900 transition-colors">
          ← Atrás
        </button>
        <button onClick={next} disabled={!canContinue} className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200">
          {form.agentes.validador ? 'Continuar →' : 'Enviar y configurar →'}
        </button>
      </div>
    </div>
  )
}
