import { useParams } from 'react-router-dom';

const CONTENT = {
  terminos: {
    title: 'Términos y Condiciones',
    body: `PrácticaPE es una plataforma de empleo para Piura, Perú. Al usar este servicio aceptas:
- Proporcionar información veraz en tu perfil y postulaciones.
- No publicar ofertas fraudulentas ni contenido engañoso.
- El contacto de empleadores solo se revela tras postular.
- PrácticaPE puede moderar o eliminar contenido que viole estas normas.

© 2025 PrácticaPE. Todos los derechos reservados.`,
  },
  privacidad: {
    title: 'Política de Privacidad',
    body: `Recopilamos el correo electrónico, nombre y datos de perfil que tú ingresas.
- No compartimos tu información con terceros sin tu consentimiento.
- Tu contraseña está cifrada con bcrypt; nunca la almacenamos en claro.
- Los OTP expiran en 10 minutos y no se guardan tras su uso.
- Puedes solicitar la eliminación de tu cuenta escribiéndonos.

Base legal: consentimiento explícito al registrarte.`,
  },
  guias: {
    title: 'Guías y Recursos',
    body: `Recursos para candidatos:
• Cómo hacer un CV para prácticas en Piura
• Qué es el Convenio de Prácticas y cómo firmarlo
• Derechos del practicante según la Ley 28518 (Perú)
• Cómo calcular tu salario de medio tiempo

Recursos para empresas:
• Cómo publicar una oferta verificada
• Obligaciones del empleador con practicantes
• Formato de Convenio Marco con universidades`,
  },
};

export default function Legal({ tipo: propTipo }) {
  const { tipo: paramTipo } = useParams();
  const tipo = propTipo || paramTipo;
  const content = CONTENT[tipo] || CONTENT.terminos;

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-display font-bold text-3xl uppercase tracking-tight mb-8">{content.title}</h1>
      <div className="card">
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted">{content.body}</p>
      </div>
    </main>
  );
}
