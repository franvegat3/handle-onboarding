'use client'
import { FormData, AseguradoraValidador, DestinatarioReporte } from '@/app/page'

interface Props {
  form: FormData
  update: (p: Partial<FormData>) => void
  prev: () => void
  onSubmit: () => void
  loading: boolean
  error: string
}

const emptyAseg = (): AseguradoraValidador => ({ nombre: '', usuario: '', contrasena: '', prioridad: '' })
const emptyDest = (): DestinatarioReporte => ({ nombre: '', correo: '', recibeReporte: true, accesoPortal: true })

export default function StepValidador({ form, update, prev, onSubmit, loading, error }: Props) {
  const aseguradoras = form.aseguradorasValidador
  const destinatarios = form.destinatariosReporte

  const updateAseg = (i: number, partial: Partial<AseguradoraValidador>) => {
    update({ aseguradorasValidador: aseguradoras.map((a, idx) => idx === i ? { ...a, ...partial } : a) })
  }
  const updateDest = (i: number, partial: Partial<DestinatarioReporte>) => {
    update({ destinatariosReporte: destinatarios.map((d, idx) => idx === i ? { ...d, ...partial } : d) })
  }

  const toggleFormato = (fmt: 'excel' | 'correo' | 'dashboard') => {
    const current = form.formatoReporte
    const next = current.includes(fmt) ? current.filter(f => f !== fmt) : [...current, fmt]
    update({ formatoReporte: next })
  }

  const canSubmit = aseguradoras.some(a => a.nombre.trim()) && form.frecuenciaMonitoreo

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-orange-950/60 border border-orange-800 rounded-full px-3 py-1 text-xs text-orange-400 font-medium mb-3">
          ✅ Validador de Pagos
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Portales a monitorear</h2>
        <p className="text-neutral-400 text-sm">El agente ingresará automáticamente a estos portales para revisar pagos.</p>
      </div>

      <div className="space-y-4 mb-4 max-h-[40vh] overflow-y-auto pr-1">
        {aseguradoras.map((aseg, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-neutral-500 font-medium">ASEGURADORA {i + 1}</span>
              {aseguradoras.length > 1 && (
                <button onClick={() => update({ aseguradorasValidador: aseguradoras.filter((_, idx) => idx !== i) })}
                  className="text-neutral-600 hover:text-red-400 text-xs">✕ Eliminar</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input type="text" value={aseg.nombre} onChange={(e) => updateAseg(i, { nombre: e.target.value })}
                placeholder="Aseguradora (Ej: GNP)" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
              <input type="text" value={aseg.prioridad} onChange={(e) => updateAseg(i, { prioridad: e.target.value })}
                placeholder="Prioridad (Sí / No)" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" value={aseg.usuario} onChange={(e) => updateAseg(i, { usuario: e.target.value })}
                placeholder="Usuario del portal" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
              <input type="password" value={aseg.contrasena} onChange={(e) => updateAseg(i, { contrasena: e.target.value })}
                placeholder="Contraseña" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => update({ aseguradorasValidador: [...aseguradoras, emptyAseg()] })}
        className="w-full py-2 rounded-lg border border-dashed border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 transition-colors mb-5">
        + Agregar aseguradora
      </button>

      {/* Configuración del reporte */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-white mb-3">Configuración del reporte</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-neutral-500 mb-2">FRECUENCIA</p>
            <div className="flex gap-3">
              {(['diaria', 'semanal'] as const).map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="frecuencia" checked={form.frecuenciaMonitoreo === f}
                    onChange={() => update({ frecuenciaMonitoreo: f })} className="accent-orange-500" />
                  <span className="text-sm text-neutral-300 capitalize">{f}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-2">FORMATO</p>
            <div className="flex gap-3">
              {(['excel', 'correo', 'dashboard'] as const).map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.formatoReporte.includes(f)}
                    onChange={() => toggleFormato(f)} className="accent-orange-500" />
                  <span className="text-sm text-neutral-300 capitalize">{f}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-2">¿ALERTAS DE PAGOS VENCIDOS?</p>
            <div className="flex gap-3">
              {([true, false] as const).map(val => (
                <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="alertas" checked={form.alertasPagosVencidos === val}
                    onChange={() => update({ alertasPagosVencidos: val })} className="accent-orange-500" />
                  <span className="text-sm text-neutral-300">{val ? 'Sí' : 'No'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destinatarios */}
      <div className="space-y-3 mb-4">
        <p className="text-sm font-medium text-white">¿Quién recibe los reportes?</p>
        {destinatarios.map((dest, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input type="text" value={dest.nombre} onChange={(e) => updateDest(i, { nombre: e.target.value })}
                placeholder="Nombre" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
              <input type="email" value={dest.correo} onChange={(e) => updateDest(i, { correo: e.target.value })}
                placeholder="correo@empresa.com" className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white" />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={dest.recibeReporte} onChange={(e) => updateDest(i, { recibeReporte: e.target.checked })} className="accent-orange-500" />
                <span className="text-xs text-neutral-400">Recibe reporte</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={dest.accesoPortal} onChange={(e) => updateDest(i, { accesoPortal: e.target.checked })} className="accent-orange-500" />
                <span className="text-xs text-neutral-400">Acceso al portal</span>
              </label>
            </div>
          </div>
        ))}
        <button onClick={() => update({ destinatariosReporte: [...destinatarios, emptyDest()] })}
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">+ Agregar destinatario</button>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">{error}</div>
      )}

      <div className="flex gap-3">
        <button onClick={prev} className="px-5 py-3 rounded-lg border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-900 transition-colors">
          ← Atrás
        </button>
        <button onClick={onSubmit} disabled={!canSubmit || loading}
          className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200 flex items-center justify-center gap-2">
          {loading ? (
            <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Configurando agentes...</>
          ) : 'Enviar y configurar agentes →'}
        </button>
      </div>
    </div>
  )
}
