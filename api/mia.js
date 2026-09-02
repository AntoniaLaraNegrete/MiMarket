// Esta función corre en el SERVIDOR de Vercel, nunca en el navegador del cliente.
// Por eso la clave de Anthropic (ANTHROPIC_API_KEY) permanece secreta:
// el navegador solo le habla a esta función, y esta función le habla a Anthropic.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // No revienta con un error feo — responde algo entendible para mostrar en la app.
    return res.status(200).json({
      content: [{ type: 'text', text: 'Mia todavía no está configurada. Pídele a la administradora que active esta función. 🙏' }],
    });
  }

  const { context, messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Faltan los mensajes de la conversación' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1000,
        system: `Eres una asesora financiera amigable y cercana para dueñas de minimarkets en Chile. Tu nombre es "Mia". Hablas en español chileno, de forma cálida y simple. Siempre quieres lo mejor para el negocio. Das consejos prácticos y concretos basados en los datos reales del negocio. Usas emojis ocasionalmente. Cuando los números son buenos los celebras, cuando hay problemas los señalas con cariño y soluciones. Formato de moneda chilena ($ con puntos). Aquí están los datos actuales:\n\n${context || ''}`,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Anthropic:', data);
      return res.status(200).json({
        content: [{ type: 'text', text: 'Tuve un problema conectándome. Intenta de nuevo en un momento 🙏' }],
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Error en /api/mia:', err);
    return res.status(200).json({
      content: [{ type: 'text', text: 'Tuve un problema conectándome. Intenta de nuevo en un momento 🙏' }],
    });
  }
}
