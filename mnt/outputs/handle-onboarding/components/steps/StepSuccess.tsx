'use client'
import { FormData } from '@/app/page'

interface Props { form: FormData }

export default function StepSuccess({ form }: Props) {
  return (
    <div className="text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 rounded-full bg-green-600/20 border-2 border-green-600 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-white mb-3">¡Listo, {form.empresa}!</h2>
      <p className="text-neutral-400 mb-8 max-w-md mx-auto">
        Recibimos tu información. Nuestro agente de IA está configurando tu cuenta en Handle ahora mismo.
        Recibirás un correo de confirmación cuando todo esté listo.
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-left max-w-md mx-auto mb-8">
        <p className="text-xs text-neutral-500 font-medium mb-3">RESUMEN DE TU CONFIGURACIÓN</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-400">Empresa</span>
            <span className="text-white font-medium">{form.empresa}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Email del agente</span>
            <span className="text-green-400 font-mono text-xs">cotizador.{form.emailPrefix}@handle.run</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Agentes</span>
            <span className="text-white">
              {[form.agentes.cotizador && 'Cotizador', form.agentes.validador && 'Validador'].filter(Boolean).join(', ')}
            </span>
          </div>
          {form.agentes.cotizador && (
            <div className="flex justify-between">
              <span className="text-neutral-400">Aseguradoras</span>
              <span className="text-white">{form.aseguradoras.filter(a => a.nombre).length} configuradas</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-400">Usuarios</span>
            <span className="text-white">{form.usuarios.filter(u => u.correo).length} + 2 admins Handle</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <a href="https://app.handle.run/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold text-sm hover:bg-neutral-200 transition-colors">
          Acceder a Handle →
        </a>
        <p className="text-xs text-neutral-500">
          ¿Dudas? Escríbenos a{' '}
          <a href="mailto:francisco.vega@usehandle.ai" className="text-neutral-300 hover:underline">
            francisco.vega@usehandle.ai
          </a>
        </p>
      </div>
    </div>
  )
}
