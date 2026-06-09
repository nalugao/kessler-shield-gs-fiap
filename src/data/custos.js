const custos = [
  {
    nome: "Hardware",
    valor: "US$ 10–30",
    unidade: "milhões",
    detalhes: [
      "Plataforma SmallSat",
      "Sistema de captura",
      "Sensores e navegação orbital"
    ],
    explicacao:
      "Faixa conceitual para um SmallSat mais sofisticado com subsistemas embarcados. O custo real depende de massa, propulsão, autonomia, redundância, TRL e complexidade da captura."
  },
  {
    nome: "Lançamento",
    valor: "US$ 350 mil–1,4",
    unidade: "milhões",
    detalhes: [
      "Rideshare orbital",
      "Inserção em órbita baixa",
      "Referência até ~200 kg"
    ],
    explicacao:
      "Estimativa baseada em referência pública de rideshare: US$ 350 mil para 50 kg e acréscimo por kg adicional. Não inclui todos os custos de integração, licenciamento, seguros e operação."
  },
  {
    nome: "Software",
    valor: "US$ 500 mil–3",
    unidade: "milhões",
    detalhes: [
      "Rastreamento",
      "Telemetria",
      "Motor de risco e interface de missão"
    ],
    explicacao:
      "Faixa conceitual para software de missão, simulação, telemetria, dashboard operacional e análise de risco. O custo real varia conforme criticidade, validação, integração com sensores e requisitos de segurança."
  }
];

export default custos;