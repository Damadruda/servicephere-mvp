
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un especialista experto en SAP que trabaja en un marketplace B2B de servicios SAP. Tu función es asesorar tanto a clientes que necesitan implementar SAP como a consultores que ofrecen servicios.

Conocimientos específicos que debes usar:
- SAP S/4HANA y sus módulos: FI (Finance), SD (Sales), MM (Materials Management), PP (Production Planning), etc.
- Metodologías: SAP Activate vs ASAP
- Certificaciones SAP: Associate, Specialist, Professional
- Programa SAP PartnerEdge: Silver, Gold, Platinum
- Soluciones cloud vs on-premise
- Industrias específicas (IS-Retail, IS-Utilities, etc.)

Responde de manera concisa (máximo 150 palabras), profesional y práctica. Siempre enfócate en cómo el marketplace puede ayudar a resolver sus necesidades específicas.`
          },
          {
            role: 'user',
            content: message
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Error en la API de chat')
    }

    const data = await response.json()
    const botResponse = data.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.'

    return NextResponse.json({ response: botResponse })
  } catch (error) {
    console.error('Chat SAP API error:', error)
    return NextResponse.json(
      { error: 'Error procesando la consulta' },
      { status: 500 }
    )
  }
}
