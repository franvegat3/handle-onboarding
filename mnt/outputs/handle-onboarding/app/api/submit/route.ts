import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const HANDLE_ADMIN_EMAIL = 'francisco.vega@usehandle.ai'
const HANDLE_JUSTIN_EMAIL = 'justin@usehandle.ai'

// ─── Main API Route ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json()

    if (!formData.empresa || !formData.emailPrefix) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Build the onboarding instructions for Claude
    const setupInstructions = buildSetupInstructions(formData)

    // Call Anthropic API to get the setup plan
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      // If no API key, just log the data and return success
      // (fallback: email or store in DB)
      console.log('=== ONBOARDING SUBMISSION (no API key) ===')
      console.log(JSON.stringify(formData, null, 2))
      console.log('=== SETUP INSTRUCTIONS ===')
      console.log(setupInstructions)

      return NextResponse.json({
        success: true,
        message: 'Datos recibidos. Configura ANTHROPIC_API_KEY para activar la automatización.',
        setupInstructions,
      })
    }

    // With API key: call Claude to generate setup plan
    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Eres el agente de onboarding de Handle. Recibiste un nuevo formulario de cliente.

Analiza estos datos y genera:
1. Un resumen estructurado del setup a realizar
2. Cualquier dato faltante o inconsistencia que debas reportar
3. El plan de acción paso a paso

DATOS DEL CLIENTE:
${setupInstructions}

Responde en JSON con esta estructura:
{
  "resumen": "...",
  "datosCompletos": true/false,
  "datosFaltantes": ["..."],
  "planAccion": ["paso1", "paso2", ...],
  "readyToSetup": true/false
}`,
        },
      ],
    })

    const content = response.content[0]
    let plan = null
    if (content.type === 'text') {
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/)
        plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      } catch {
        plan = { resumen: content.text }
      }
    }

    // TODO: Trigger actual Handle setup automation
    // This is where you'd call the Handle setup agent with Playwright
    // For now, we log and return the plan
    console.log('Setup plan:', plan)

    return NextResponse.json({
      success: true,
      message: 'Onboarding en proceso',
      plan,
      setupInstructions,
    })

  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Error procesando el formulario' },
      { status: 500 }
    )
  }
}

// ─── Build structured setup instructions ─────────────────────────────────────

function buildSetupInstructions(form: Record<string, unknown>): string {
  const lines: string[] = []

  lines.push(`## EMPRESA: ${form.empresa}`)
  lines.push(`Dominio: ${form.dominio}`)
  lines.push(`Email prefix: ${form.emailPrefix}`)
  lines.push(`Agentes a instalar: ${JSON.stringify(form.agentes)}`)
  lines.push('')

  lines.push(`## CUENTAS A CREAR`)
  lines.push(`Siempre agregar como Admin:`)
  lines.push(`- ${HANDLE_ADMIN_EMAIL} (Admin)`)
  lines.push(`- ${HANDLE_JUSTIN_EMAIL} (Admin)`)
  lines.push(`Usuarios del cliente:`)
  const usuarios = form.usuarios as Array<Record<string, unknown>>
  for (const u of usuarios) {
    if (u.correo) {
      lines.push(`- ${u.nombre} <${u.correo}> (User) | Envía cotizaciones: ${u.enviaCotizaciones} | Acceso portal: ${u.accesoPortal}`)
    }
  }
  lines.push('')

  const agentes = form.agentes as Record<string, boolean>
  if (agentes.cotizador) {
    lines.push(`## COTIZADOR`)
    lines.push(`Aseguradoras reales (configurar en Settings > Insurer Directory):`)
    const aseguradoras = form.aseguradoras as Array<Record<string, unknown>>
    for (const a of aseguradoras) {
      if (a.nombre) {
        const ramos = (a.ramos as string[]).join(', ') || 'Sin ramos especificados'
        const correos = (a.correos as string[]).filter(Boolean).join(' | ') || 'Sin correo'
        lines.push(`- ${a.nombre}: Ramos=[${ramos}] | Correos: ${correos}`)
      }
    }
    lines.push('')
    lines.push(`Pasos para el Cotizador:`)
    lines.push(`1. Ir a /admin/organizations → buscar ${form.empresa} → si no existe, crear con dominio ${form.dominio} y prefix ${form.emailPrefix}`)
    lines.push(`2. Agregar cuentas de usuario (ver lista arriba)`)
    lines.push(`3. Desactivar Show Token Usage y Show Agents in Prod`)
    lines.push(`4. Ir a /admin/products → Enable Quoting Agent → ingresar prefix 'cotizador'`)
    lines.push(`5. Cambiar a la org del cliente en el account picker`)
    lines.push(`6. Ir a /insurance/agents/quoting/settings?tab=types → Agregar tipos: PRUEBA, DEMO`)
    lines.push(`7. Ir a /insurance/agents/quoting/settings → Directorio de Aseguradoras:`)
    lines.push(`   7a. Agregar CHUBB Prueba (tipo PRUEBA, email: ${HANDLE_ADMIN_EMAIL.replace('@', '+chubb@').replace('usehandle', 'usehandle')})`)
    lines.push(`   7b. Agregar HDI Prueba (tipo PRUEBA, email: ${HANDLE_ADMIN_EMAIL.replace('@', '+hdi@')})`)
    lines.push(`   7c. Agregar aseguradoras reales del cliente (ver lista arriba)`)
  }

  if (agentes.validador) {
    lines.push(`## VALIDADOR DE PAGOS`)
    lines.push(`Aseguradoras a monitorear:`)
    const asegV = form.aseguradorasValidador as Array<Record<string, unknown>>
    for (const a of asegV) {
      if (a.nombre) {
        lines.push(`- ${a.nombre}: usuario=${a.usuario} | prioridad=${a.prioridad}`)
        lines.push(`  ⚠️ Credenciales sensibles: [almacenadas seguro]`)
      }
    }
    lines.push(``)
    lines.push(`Configuración del reporte:`)
    lines.push(`- Frecuencia: ${form.frecuenciaMonitoreo}`)
    lines.push(`- Formato: ${(form.formatoReporte as string[]).join(', ')}`)
    lines.push(`- Alertas pagos vencidos: ${form.alertasPagosVencidos}`)
    lines.push(``)
    lines.push(`Pasos para el Validador:`)
    lines.push(`1. Ir a /admin/products → Enable Payment Validation Agent`)
    lines.push(`2. Configurar destinatarios del reporte`)
    lines.push(`3. Ingresar credenciales de portales de aseguradoras`)
  }

  return lines.join('\n')
}
