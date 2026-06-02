// ============================================================
// Kessler Shield — dados (referências científicas)
// ============================================================
export const REFERENCES = [
  { id: 1, tags: ["esa", "tecnologia"], labels: ["ESA", "Tecnologia"], title: "ESA Space Environment Report 2024", desc: "Relatório anual sobre densidade de detritos, eventos de fragmentação e conformidade com as diretrizes de mitigação na órbita terrestre baixa.", corrected: true, source: "esa.int — Space Safety", url: "https://www.esa.int/Space_Safety/Space_Debris" },
  { id: 2, tags: ["programa", "tecnologia"], labels: ["Programa", "Tecnologia"], title: "Kessler & Cour-Palais (1978)", desc: "Artigo seminal \"Collision Frequency of Artificial Satellites\" — origem do conceito de cascata de colisões hoje chamado Síndrome de Kessler.", corrected: false, source: "J. Geophysical Research", url: "https://agupubs.onlinelibrary.wiley.com/" },
  { id: 3, tags: ["nasa"], labels: ["NASA"], title: "NASA Orbital Debris Quarterly News", desc: "Boletim do Orbital Debris Program Office (ODPO) com contagens atualizadas de objetos catalogados e relatos de novos eventos de fragmentação.", corrected: false, source: "orbitaldebris.jsc.nasa.gov", url: "https://orbitaldebris.jsc.nasa.gov/quarterly-news/" },
  { id: 4, tags: ["mercado"], labels: ["Mercado"], title: "Panorama do Seguro Espacial", desc: "Análise do mercado global de seguro espacial: prêmios anuais, sinistros e a exposição crescente ao risco de detritos para operadores.", corrected: true, source: "Reanálise de mercado", url: "https://www.swissre.com/" },
  { id: 5, tags: ["esa", "programa"], labels: ["ESA", "Programa"], title: "ClearSpace-1 Mission", desc: "Primeira missão da ESA dedicada à remoção ativa de um objeto real em órbita, contratada como serviço de remoção de detritos.", corrected: false, source: "esa.int — ClearSpace-1", url: "https://www.esa.int/Space_Safety/ClearSpace-1" },
  { id: 6, tags: ["esa", "tecnologia"], labels: ["ESA", "Tecnologia"], title: "Zero Debris Charter", desc: "Iniciativa da ESA que estabelece a meta de não gerar novos detritos em órbita até 2030, adotada por agências e empresas signatárias.", corrected: false, source: "esa.int — Clean Space", url: "https://www.esa.int/Space_Safety/Clean_Space" },
  { id: 7, tags: ["nasa", "tecnologia"], labels: ["NASA", "Tecnologia"], title: "NASA ARES Orbital Debris Program Office", desc: "Centro de referência da NASA para modelagem de detritos, medição de fluxo e desenvolvimento de diretrizes de mitigação.", corrected: false, source: "orbitaldebris.jsc.nasa.gov", url: "https://orbitaldebris.jsc.nasa.gov/" },
  { id: 8, tags: ["spacex", "mercado"], labels: ["SpaceX", "Mercado"], title: "Starlink & Densidade Orbital", desc: "O crescimento de megaconstelações eleva a densidade de objetos em LEO e o número de manobras de prevenção de colisão por ano.", corrected: true, source: "spacex.com — Updates", url: "https://www.spacex.com/updates/" },
  { id: 9, tags: ["spacex", "tecnologia"], labels: ["SpaceX", "Tecnologia"], title: "Autonomous Collision Avoidance", desc: "Sistema autônomo de prevenção de colisões usado em constelações comerciais — referência para o subsistema de aproximação do caçador.", corrected: false, source: "spacex.com — Updates", url: "https://www.spacex.com/updates/" },
  { id: 10, tags: ["programa", "tecnologia"], labels: ["Programa", "Tecnologia"], title: "JAXA / Astroscale ELSA-d", desc: "Demonstração de captura magnética de um objeto-alvo em órbita — prova de conceito para captura cooperativa e não cooperativa.", corrected: false, source: "astroscale.com — ELSA-d", url: "https://astroscale.com/missions/elsa-d/" },
  { id: 11, tags: ["tecnologia"], labels: ["Tecnologia"], title: "Polímeros expansíveis em vácuo", desc: "Estudos sobre espumas de poliuretano e materiais de cura em vácuo aplicáveis à captura passiva e ao aumento de arrasto de detritos.", corrected: true, source: "NASA Technical Reports", url: "https://ntrs.nasa.gov/" },
  { id: 12, tags: ["tecnologia", "programa"], labels: ["Tecnologia", "Programa"], title: "RemoveDEBRIS (Surrey)", desc: "Missão demonstradora que testou rede e arpão para captura de detritos em órbita — base comparativa para métodos de captura.", corrected: false, source: "Surrey Space Centre", url: "https://www.surrey.ac.uk/surrey-space-centre" },
  { id: 13, tags: ["mercado", "programa"], labels: ["Mercado", "Programa"], title: "OECD — The Space Economy", desc: "Estimativas do tamanho da economia espacial e do custo econômico de longo prazo da degradação do ambiente orbital.", corrected: false, source: "oecd.org", url: "https://www.oecd.org/" },
  { id: 14, tags: ["esa", "tecnologia"], labels: ["ESA", "Tecnologia"], title: "ESA DISCOS Database", desc: "Banco de dados de objetos espaciais da ESA — catálogo de lançamentos, objetos e fragmentos usado em modelagem de risco.", corrected: false, source: "esa.int — DISCOS", url: "https://www.esa.int/Space_Safety/Space_Debris" },
  { id: 15, tags: ["nasa", "tecnologia"], labels: ["NASA", "Tecnologia"], title: "NASA Standard Breakup Model", desc: "Modelo padrão de fragmentação usado para estimar o número e a distribuição de fragmentos gerados por uma colisão ou explosão.", corrected: false, source: "orbitaldebris.jsc.nasa.gov", url: "https://orbitaldebris.jsc.nasa.gov/modeling/" },
  { id: 16, tags: ["programa", "mercado"], labels: ["Programa", "Mercado"], title: "IADC Space Debris Mitigation Guidelines", desc: "Diretrizes do comitê inter-agências (IADC) sobre a regra dos 25 anos de desorbitação e práticas de mitigação — base regulatória do modelo.", corrected: true, source: "iadc-home.org", url: "https://www.iadc-home.org/" },
  { id: 17, tags: ["mercado"], labels: ["Mercado"], title: "Créditos de sustentabilidade orbital", desc: "Propostas acadêmicas e regulatórias para precificar a poluição orbital — fundamento conceitual do modelo de créditos orbitais do projeto.", corrected: false, source: "World Economic Forum", url: "https://www.weforum.org/" }
];

export const REF_FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "esa", label: "ESA" },
  { key: "nasa", label: "NASA" },
  { key: "spacex", label: "SpaceX" },
  { key: "mercado", label: "Mercado" },
  { key: "tecnologia", label: "Tecnologia" },
  { key: "programa", label: "Programa" }
];

export const TAG_CLASS = {
  "ESA": "tag--esa", "NASA": "tag--nasa", "SpaceX": "tag--spacex",
  "Mercado": "tag--mercado", "Tecnologia": "tag--tecnologia", "Programa": "tag--programa"
};
