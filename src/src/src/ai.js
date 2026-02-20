export function aiSuggest({ mode, input }) {
  const txt = (input || "").trim();
  if (!txt) return "";

  if (mode === "prescricao") {
    return `Sugestão (revisar):\n- Considerar analgesia conforme dor referida.\n- Orientar higiene local e retorno.\nObservações do caso: ${txt}`;
  }

  if (mode === "procedimento") {
    return `Descrição sugerida (editar):\nRealizado procedimento odontológico conforme avaliação clínica. ${txt}\nPaciente orientado(a) quanto aos cuidados pós-procedimento e sinais de alerta.`;
  }

  if (mode === "planejamento") {
    return `Plano sugerido (revisar):\n1) Confirmar diagnóstico com exames complementares.\n2) Definir sequência de sessões.\n3) Reavaliar em retorno.\nBase do caso: ${txt}`;
  }

  return `Sugestão:\n${txt}`;
}
