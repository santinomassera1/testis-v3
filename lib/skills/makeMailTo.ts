interface MailToOptions {
  to: string;
  subject: string;
  body: string;
  type: 'mailto' | 'gmail';
}

export async function makeMailTo(options: MailToOptions): Promise<{ url: string; type: string }> {
  const { to, subject, body, type } = options;
  
  // Codificar los parámetros para URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  let url: string;
  
  if (type === 'gmail') {
    // Generar enlace para Gmail Compose
    url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodedSubject}&body=${encodedBody}`;
  } else {
    // Generar enlace mailto estándar
    url = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
  }
  
  return {
    url,
    type
  };
}

// Función helper para abrir el correo en una nueva ventana
export function openMailTo(options: MailToOptions): void {
  makeMailTo(options).then(({ url, type }) => {
    if (type === 'gmail') {
      // Abrir Gmail en nueva ventana
      window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    } else {
      // Abrir cliente de correo por defecto
      window.location.href = url;
    }
  });
}

// Plantillas predefinidas para diferentes tipos de correos
export const mailTemplates = {
  docente: {
    subject: 'Consulta sobre [Materia]',
    body: `Estimado/a Profesor/a,

Le escribo para consultar sobre [tema específico] en la materia [nombre de la materia].

[Detalle de la consulta]

Desde ya, muchas gracias por su tiempo.

Saludos cordiales,
[Tu nombre]`
  },
  
  secretaria: {
    subject: 'Consulta administrativa - [Asunto]',
    body: `Estimados/as,

Me dirijo a ustedes para consultar sobre [tema administrativo].

[Detalle de la consulta]

Agradezco su atención y quedo a la espera de su respuesta.

Saludos cordiales,
[Tu nombre]
[Legajo/Número de estudiante]`
  },
  
  coordinacion: {
    subject: 'Consulta sobre plan de estudios',
    body: `Estimados/as Coordinadores/as,

Le escribo para consultar sobre [tema del plan de estudios].

[Detalle de la consulta]

Desde ya, muchas gracias.

Saludos cordiales,
[Tu nombre]`
  }
};
