'use client'
import { FormData, Usuario } from '@/app/page'

interface Props {
  form: FormData
  update: (p: Partial<FormData>) => void
  next: () => void
  prev: () => void
}

const emptyUser = (): Usuario => ({ nombre: '', correo: '', enviaCotizaciones: true, accesoPortal: true })

export default function StepTeam({ form, update, next, prev }: Props) {
  const users = form.usuarios

  const updateUser = (i: number, partial: Partial<Usuario>) => {
    const updated = users.map((u, idx) => idx === i ? { ...u, ...partial } : u)
    update({ usuarios: updated })
  }

  const addUser = () => update({ usuarios: [...users, emptyUser()] })
  const removeUser = (i: number) => update({ usuarios: users.filter((_, idx) => idx !== i) })

  const canContinue = users.some(u => u.nombre.trim() && u.correo.trim())

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Equipo de trabajo</h2>
        <p className="text-neutral-400 text-sm">¿Quiénes van a usar Handle? Agrega a todos los que necesiten acceso.</p>
      </div>

      <div className="space-y-4 mb-4">
        {users.map((user, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-neutral-500 font-medium">USUARIO {i + 1}</span>
              {users.length > 1 && (
                <button onClick={() => removeUser(i)} className="text-neutral-600 hover:text-red-400 text-xs transition-colors">
                  ✕ Eliminar
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                value={user.nombre}
                onChange={(e) => updateUser(i, { nombre: e.target.value })}
                placeholder="Nombre completo"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
              <input
                type="email"
                value={user.correo}
                onChange={(e) => updateUser(i, { correo: e.target.value })}
                placeholder="correo@empresa.com"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={user.enviaCotizaciones} onChange={(e) => updateUser(i, { enviaCotizaciones: e.target.checked })}
                  className="w-4 h-4 rounded accent-green-500" />
                <span className="text-xs text-neutral-400">Envía cotizaciones</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={user.accesoPortal} onChange={(e) => updateUser(i, { accesoPortal: e.target.checked })}
                  className="w-4 h-4 rounded accent-green-500" />
                <span className="text-xs text-neutral-400">Acceso al portal</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addUser} className="w-full py-2.5 rounded-lg border border-dashed border-neutral-700 text-neutral-400 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors mb-6">
        + Agregar usuario
      </button>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 mb-6 text-xs text-neutral-500">
        💡 Los usuarios de Handle (francisco.vega@usehandle.ai y justin@usehandle.ai) se agregarán automáticamente como administradores.
      </div>

      <div className="flex gap-3">
        <button onClick={prev} className="px-5 py-3 rounded-lg border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-900 transition-colors">
          ← Atrás
        </button>
        <button onClick={next} disabled={!canContinue} className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200">
          Continuar →
        </button>
      </div>
    </div>
  )
}
