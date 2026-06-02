<<<<<<< Updated upstream
const SECTIONS_PT = [
=======
export const REFS = [
>>>>>>> Stashed changes
  {
    id: 1,
    tags: ["ESA", "Detritos"],
    title: "ESA Space Environment Report 2025",
    desc: "~40.000 objetos rastreados em órbita, dos quais ~11.000 são payloads ativos. Modelo MASTER-8, dados de agosto/2024.",
    source: "esa.int",
    url: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025",
    corrected: false,
  },
  {
    id: 2,
    tags: ["ESA", "Detritos"],
    title: "About Space Debris — ESA Space Safety",
    desc: "Fragmentos >1cm: mais de 1,2 milhão de objetos. Fonte primária da ESA.",
    source: "esa.int",
    url: "https://www.esa.int/Space_Safety/Space_Debris/About_space_debris",
    corrected: true,
  },
  {
    id: 3,
    tags: ["NASA", "Detritos"],
    title: "NASA Orbital Debris Program Office — FAQ",
    desc: "Velocidade média de colisão: ~10 km/s. Objetos orbitam a 7–8 km/s (≈28.000 km/h).",
    source: "orbitaldebris.jsc.nasa.gov",
    url: "https://orbitaldebris.jsc.nasa.gov/faq/",
    corrected: true,
  },
  {
    id: 4,
    tags: ["NASA", "Detritos"],
    title: "IADC Report — Status of the Space Debris Environment",
    desc: "Relatório interagências (NASA, ESA, JAXA, Roscosmos). Referência governamental padrão para estatísticas de detritos em órbita.",
    source: "unoosa.org · 2025",
    url: "https://www.unoosa.org/res/oosadoc/data/documents/2025/aac_105c_12025crp/aac_105c_12025crp_10_0_html/AC105_C1_2025_CRP10E.pdf",
    corrected: false,
  },
  {
    id: 5,
    tags: ["NASA", "Detritos"],
    title:
      "Kessler & Cour-Palais — Collision Frequency of Artificial Satellites (1978)",
    desc: "Artigo fundacional que previu a cascata colisional em LEO. Journal of Geophysical Research, junho de 1978.",
    source: "Journal of Geophysical Research",
    url: "https://doi.org/10.1029/JA083iA06p02637",
    corrected: false,
  },
  {
    id: 6,
    tags: ["Mercado"],
    title: "Seradata / Slingshot Aerospace — Global Space Insurance Review",
    desc: "~US$580M em prêmios brutos (2024). Apenas ~300 dos ~10.000 satélites em órbita são segurados. Mercado concentrado em GEO.",
    source: "satnews.com · ago. 2025",
    url: "https://satnews.com/2025/08/17/space-insurance-promising-start-to-the-year-marred-only-by-methanesat-claim/",
    corrected: true,
  },
  {
    id: 7,
    tags: ["Mercado"],
    title: "Gallagher Specialty — Space Market Update Q4 2025",
    desc: "Relatório trimestral de corretor especialista. Confirma prêmios na faixa de US$550–600M/ano com projeção positiva para 2025.",
    source: "specialty.ajg.com",
    url: "https://specialty.ajg.com/plane-talking/space-market-update-q4-2025",
    corrected: false,
  },
  {
    id: 8,
    tags: ["SpaceX", "Mercado"],
    title: "SpaceX Transporter — Rideshare Pricing 2026",
    desc: "Preço atual: US$7.000/kg para SSO (Transporter-16+).",
    source: "spacex.com · newspaceeconomy.ca",
    url: "https://newspaceeconomy.ca/2026/02/27/satellite-ridesharing-market-analysis-2026/",
    corrected: true,
  },
  {
    id: 9,
    tags: ["Mercado"],
    title: "NanoAvionics — How Much Do CubeSats Cost?",
    desc: "Faixa US$200K–500K para CubeSat 12U comercial (construção apenas). Lançamento via rideshare custa US$84K–540K separadamente.",
    source: "nanoavionics.com",
    url: "https://nanoavionics.com/blog/how-much-do-cubesats-and-smallsats-cost/",
    corrected: false,
  },
  {
    id: 10,
    tags: ["NASA", "Programa"],
    title: "NASA SBIR — Active Debris Removal Technologies",
    desc: "Subtópico explícito para remoção de detritos. Phase I: até US$150K. Phase II: até US$850K. ~US$180M/ano investidos no total.",
    source: "sbir.gsfc.nasa.gov",
    url: "https://sbir.gsfc.nasa.gov/content/active-debris-removal-technologies",
    corrected: false,
  },
  {
    id: 11,
    tags: ["NASA", "Programa"],
    title: "NASA SSPICY — Orbital Debris Inspection (Starfish Space)",
    desc: "Contrato de US$15M via SBIR Phase III para missão de inspeção de satélite defunto. Exemplo real de financiamento ADR pela NASA.",
    source: "nasa.gov",
    url: "https://www.nasa.gov/centers-and-facilities/ames/getting-sspicy-nasa-funds-orbital-debris-inspection-mission/",
    corrected: false,
  },
  {
    id: 12,
    tags: ["ESA", "Programa"],
    title: "ESA Space Safety Programme — CM25 Funding Boost (2025)",
    desc: "€955M aprovados para 3 anos no Conselho Ministerial de nov/2025 — 30% acima do solicitado. Inclui ADRIOS, missões CAT e RISE.",
    source: "esa.int",
    url: "https://www.esa.int/Space_Safety/Boost_in_funding_expands_Space_Safety_programme",
    corrected: false,
  },
  {
    id: 13,
    tags: ["ESA", "Tecnologia"],
    title:
      "ESA ACT — Expanding Foam for Active Debris Removal (Univ. Pisa, 2011)",
    desc: "Estudo pioneiro de espuma polimérica para desorbitação de detritos. Modelo Rayleigh-Plesset. TRL estimado: 2–3.",
    source: "esa.int/gsp/ACT",
    url: "https://www.esa.int/gsp/ACT/doc/ARI/ARI%20Study%20Report/ACT-RPT-MAD-ARI-10-6411-Pisa-Active_Removal_of_Space_Debris-Foam.pdf",
    corrected: false,
  },
  {
    id: 14,
    tags: ["Tecnologia"],
    title:
      "REDEMPTION — Polyurethane Foam Experiment (Univ. Bologna / ESA REXUS)",
    desc: "Teste de espuma de poliuretano em microgravidade via programa REXUS. Experimento I-FOAM voou na missão STS-134 (2011).",
    source: "ui.adsabs.harvard.edu",
    url: "https://ui.adsabs.harvard.edu/abs/2013ESASP.723E.169R/abstract",
    corrected: false,
  },
  {
    id: 15,
    tags: ["ESA", "Tecnologia", "Programa"],
    title: "ClearSpace-1 — Primeira Missão Dedicada a Remoção de Detritos",
    desc: "Contrato €86M (ESA + ClearSpace SA). Alvo atual: PROBA-1 (95kg). Lançamento previsto ~2028. Usa braços robóticos.",
    source: "esa.int/Space_Safety/ClearSpace-1",
    url: "https://www.esa.int/Space_Safety/ClearSpace-1",
    corrected: false,
  },
  {
    id: 16,
    tags: ["Tecnologia"],
    title:
      "RemoveDEBRIS — Primeira Captura por Rede em Órbita (Univ. Surrey, 2018)",
    desc: "Captura com rede (2018) e arpão a 20 m/s (fev/2019). Primeira missão ADR demonstrada em órbita. Financiada pela UE (FP7).",
    source: "ScienceDirect",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0094576519312512",
    corrected: false,
  },
  {
    id: 17,
    tags: ["Tecnologia", "Programa"],
    title:
      "Astroscale ELSA-d e ADRAS-J — Captura Magnética e Inspeção (2021–2024)",
    desc: "ADRAS-J (2024): primeira aproximação de detrito não cooperativo real. ELSA-M planeja remover satélites OneWeb em fim de vida.",
    source: "astroscale.com",
    url: "https://www.astroscale.com/en/missions/elsa-d",
    corrected: false,
  },
];

const SECTIONS_EN = [
  {
    id: "detritos",
    label: "01 — Space Debris",
    title: "Orbital Debris Population",
    intro:
      "Space debris numbers change with each annual report. The data below is the most recent available, based on primary sources from space agencies and international organizations.",
    articles: [
      {
        id: "esa-env-2025",
        tag: "ESA · 2025",
        title: "ESA Space Environment Report 2025",
        summary:
          "The most complete annual report on the orbital debris population. It confirms ~40,000 objects tracked by space surveillance networks, of which ~11,000 are active payloads. It uses the MASTER-8 model, with August 2024 as reference, to estimate more than 1.2 million objects between 1 cm and 10 cm, and ~140 million objects between 1 mm and 1 cm.",
        stats: [
          { value: "~40,000", label: "tracked objects in orbit" },
          { value: "~11,000", label: "active payloads" },
          { value: ">1.2M", label: "objects between 1 cm and 10 cm, MASTER-8" },
        ],
        source: "ESA Space Safety — esa.int",
        url: "https://www.esa.int/Space_Safety/Space_Debris/ESA_Space_Environment_Report_2025",
        correction: null,
      },
      {
        id: "esa-about",
        tag: "ESA · Continuous",
        title: "About Space Debris — ESA Space Safety",
        summary:
          "ESA reference page about space debris. It explains size ranges, risks and tracking methodology. Fragments smaller than 10 cm are not individually tracked — their population is estimated using statistical models and impact experiments.",
        stats: [],
        source: "ESA — esa.int/Space_Safety/Space_Debris/About_space_debris",
        url: "https://www.esa.int/Space_Safety/Space_Debris/About_space_debris",
        correction: {
          errado: '"500K objects larger than 1 cm"',
          correto:
            '">1.2 million objects between 1 cm and 10 cm" (ESA/MASTER-8, 2025)',
        },
      },
      {
        id: "nasa-odpo",
        tag: "NASA · Continuous",
        title: "NASA Orbital Debris Program Office — FAQ",
        summary:
          "Primary source for the average collision speed in LEO. NASA's Orbital Debris Program Office states that the average impact speed between objects in orbit is approximately 10 km/s. Individual objects orbit at 7–8 km/s, equivalent to ~28,000 km/h — a number that often causes unit confusion in pitches.",
        stats: [
          { value: "~10 km/s", label: "average collision speed in LEO" },
          { value: "7–8 km/s", label: "orbital speed of objects" },
          { value: "~28,000 km/h", label: "equivalent in km/h, not km/s" },
        ],
        source: "NASA ODPO — orbitaldebris.jsc.nasa.gov",
        url: "https://orbitaldebris.jsc.nasa.gov/faq/",
        correction: {
          errado: '"28 km/s average impact speed"',
          correto:
            '"~10 km/s collision speed; objects orbit at ~28,000 km/h, not km/s"',
        },
      },
      {
        id: "iadc-2025",
        tag: "UNOOSA/IADC · 2025",
        title: "IADC Report on the Status of the Space Debris Environment",
        summary:
          "Report from the Inter-Agency Space Debris Coordination Committee (IADC), an organization that brings together NASA, ESA, JAXA, Roscosmos and other agencies. Published through UNOOSA, it is the standard intergovernmental reference for debris statistics.",
        stats: [],
        source: "UNOOSA — unoosa.org",
        url: "https://www.unoosa.org/res/oosadoc/data/documents/2025/aac_105c_12025crp/aac_105c_12025crp_10_0_html/AC105_C1_2025_CRP10E.pdf",
        correction: null,
      },
      {
        id: "kessler-1978",
        tag: "NASA · 1978",
        title:
          "Kessler & Cour-Palais — Collision Frequency of Artificial Satellites: The Creation of a Debris Belt",
        summary:
          "Foundational paper published in the Journal of Geophysical Research in June 1978. Donald J. Kessler and Burton G. Cour-Palais mathematically demonstrated that collisions between objects in LEO could generate fragments faster than atmospheric decay removes them, making the process self-sustaining, also known as a collisional cascade. The term 'Kessler syndrome' was coined by John Gabbard from NORAD — not by Kessler himself.",
        stats: [
          { value: "1978", label: "year of original publication" },
          { value: "J. Geophys. Res.", label: "publication journal" },
        ],
        source: "Journal of Geophysical Research, Vol. 83, No. A6",
        url: "https://doi.org/10.1029/JA083iA06p02637",
        correction: null,
      },
    ],
  },
  {
    id: "mercado",
    label: "02 — Market & Finance",
    title: "Space Insurance and Operational Costs",
    intro:
      "Financial data from the space market is often distorted by low-quality reports. Below are only primary sources from specialized brokers and industry operators.",
    articles: [
      {
        id: "seradata-2025",
        tag: "Seradata / Slingshot Aerospace · 2025",
        title: "Global Space Insurance Market — Annual Review",
        summary:
          "Seradata, acquired by Slingshot Aerospace, is the leading database for the space insurance market, used by brokers such as Marsh, Gallagher and Willis. In 2024, the market generated ~US$ 580 million in gross premiums against US$ 210.8 million in claims. In 2023, a negative record year, premiums were ~US$ 557 million against US$ 995 million in claims — a net loss of US$ 438 million.",
        stats: [
          { value: "~$580M", label: "annual gross premiums, 2024" },
          { value: "$210.8M", label: "claims paid, 2024" },
          { value: "~300", label: "insured satellites, out of ~10,000 in orbit" },
        ],
        source: "Seradata/Slingshot via SatNews — satnews.com, Aug. 2025",
        url: "https://satnews.com/2025/08/17/space-insurance-promising-start-to-the-year-marred-only-by-methanesat-claim/",
        correction: {
          errado: '"space insurance market worth billions of dollars"',
          correto:
            '"~US$ 550–600 million in annual gross premiums" (Seradata, primary source)',
        },
      },
      {
        id: "gallagher-q4",
        tag: "Gallagher Specialty · Q4 2025",
        title: "Space Market Update Q4 2025 — Plane Talking",
        summary:
          "Quarterly report from specialized broker Gallagher Specialty. It confirms the market premium order of magnitude and projects positive profitability for insurers in 2025 due to historically low claims. It supports Seradata's data on policy concentration in high-value GEO satellites.",
        stats: [],
        source: "Gallagher Specialty — specialty.ajg.com",
        url: "https://specialty.ajg.com/plane-talking/space-market-update-q4-2025",
        correction: null,
      },
      {
        id: "spacex-rideshare",
        tag: "SpaceX · 2026",
        title: "SpaceX Transporter — Rideshare Pricing, 2026",
        summary:
          "The SpaceX Transporter program serves sun-synchronous orbit (SSO) through Falcon 9. Pricing has been revised several times: US$ 5,000/kg in 2019, US$ 5,500/kg in Oct. 2022, US$ 6,000/kg in 2024 and US$ 7,000/kg in 2026, starting with Transporter-16. For LEO with other inclinations, SpaceX operates the Bandwagon program with negotiated pricing.",
        stats: [
          { value: "$7,000/kg", label: "current SSO price, Transporter-16+, 2026" },
          { value: "$5,500/kg", label: "historical price, Oct. 2022 — project data" },
          { value: "~$1.4M", label: "estimated launch cost for a 200 kg carrier" },
        ],
        source: "SpaceX Rideshare + New Space Economy, Feb. 2026",
        url: "https://newspaceeconomy.ca/2026/02/27/satellite-ridesharing-market-analysis-2026/",
        correction: {
          errado: '"US$ 5,500/kg for LEO"',
          correto:
            '"US$ 7,000/kg for SSO, 2026; Bandwagon program for inclined LEO"',
        },
      },
      {
        id: "cubesat-cost",
        tag: "NanoAvionics · Continuous",
        title: "How Much Do CubeSats and SmallSats Cost?",
        summary:
          "Reference guide from manufacturer NanoAvionics. The US$ 200K–500K range for a commercial 12U CubeSat, excluding launch, is validated by the industry. Cost varies heavily depending on payload, redundancy and mission. Student CubeSats cost from US$ 10K to US$ 50K; commercial platforms for critical missions can exceed US$ 1 million.",
        stats: [
          { value: "$200K–$500K", label: "range for commercial 12U construction" },
          { value: "+ $84K–$540K", label: "rideshare launch cost, separate" },
        ],
        source: "NanoAvionics — nanoavionics.com",
        url: "https://nanoavionics.com/blog/how-much-do-cubesats-and-smallsats-cost/",
        correction: null,
      },
    ],
  },
  {
    id: "programas",
    label: "03 — Agencies & Programs",
    title: "NASA, ESA and Government Funding",
    intro:
      "Government programs for active debris removal (ADR) are real and funded. Below are confirmed programs with links to primary sources.",
    articles: [
      {
        id: "nasa-sbir",
        tag: "NASA · 2025",
        title: "NASA SBIR/STTR — Active Debris Removal Technologies",
        summary:
          "NASA's SBIR program, Small Business Innovation Research, invests ~US$ 180 million per year in small U.S. companies with fewer than 500 employees. There is an explicit subtopic for 'Active Debris Removal Technologies'. Phase I: up to US$ 150,000 for 6 months. Phase II: up to US$ 850,000 for 24 months. Phase III: external funding with no defined limit.",
        stats: [
          { value: "~$180M/year", label: "total annual NASA SBIR investment" },
          { value: "$150K", label: "Phase I, project cap" },
          { value: "$850K", label: "Phase II, project cap" },
        ],
        source: "NASA SBIR/STTR — sbir.gsfc.nasa.gov",
        url: "https://sbir.gsfc.nasa.gov/content/active-debris-removal-technologies",
        correction: null,
      },
      {
        id: "nasa-sspicy",
        tag: "NASA · 2024",
        title: "NASA SSPICY — Orbital Debris Inspection Mission, Starfish Space",
        summary:
          "Real example of NASA funding for debris removal through SBIR Phase III. Starfish Space received a US$ 15 million contract for the SSPICY mission — a demonstration of rendezvous and inspection of a defunct satellite. It proves that NASA funds private ADR missions through SBIR.",
        stats: [{ value: "$15M", label: "Phase III contract, Starfish Space" }],
        source: "NASA Ames — nasa.gov",
        url: "https://www.nasa.gov/centers-and-facilities/ames/getting-sspicy-nasa-funds-orbital-debris-inspection-mission/",
        correction: null,
      },
      {
        id: "esa-adrios",
        tag: "ESA · 2025",
        title: "ESA Space Safety Programme — Boost in Funding, CM25",
        summary:
          "At the Ministerial Council in November 2025 (CM25), ESA Member States approved €955 million for the Space Safety Programme over the next three years — 30% above the requested amount. The program includes ADRIOS, Active Debris Removal/In-Orbit Servicing, as a cornerstone, with new CAT missions, standardized docking interface, and RISE, GEO mission extender, approved.",
        stats: [
          { value: "€955M", label: "approved budget for 3 years, CM25, 2025" },
          { value: "+30%", label: "above the requested budget" },
        ],
        source: "ESA Space Safety — esa.int",
        url: "https://www.esa.int/Space_Safety/Boost_in_funding_expands_Space_Safety_programme",
        correction: null,
      },
    ],
  },
  {
    id: "tecnologia",
    label: "04 — Technology",
    title: "Expanding Foam and ADR Projects",
    intro:
      "Expandable polymer technology for debris removal has real scientific grounding, although at a low technology readiness level (TRL). Below are ADR projects in operation and research.",
    articles: [
      {
        id: "esa-foam-study",
        tag: "ESA ACT · 2011",
        title:
          "Active Removal of Space Debris — Expanding Foam Application, University of Pisa / ESA ACT",
        summary:
          "Study sponsored by ESA's Advanced Concepts Team (ACT). Researchers from the University of Pisa, J. Olympio and L. Summerer, developed a polymer foam expansion model based on the Rayleigh-Plesset equation. The proposal consists of creating a 'foam ball' around the debris, increasing the area-to-mass ratio and atmospheric drag to induce reentry — without requiring physical docking, while tolerating rotating or tumbling targets.",
        stats: [
          { value: "TRL 2–3", label: "estimated technology readiness level" },
          { value: "≤1 ton", label: "target mass viable under the model" },
        ],
        source: "ESA ACT — esa.int/gsp/ACT",
        url: "https://www.esa.int/gsp/ACT/doc/ARI/ARI%20Study%20Report/ACT-RPT-MAD-ARI-10-6411-Pisa-Active_Removal_of_Space_Debris-Foam.pdf",
        correction: null,
      },
      {
        id: "bologna-redemption",
        tag: "Univ. Bologna / ESA REXUS · 2013",
        title: "REDEMPTION — Polyurethane Foam Experiment, ESA REXUS Programme",
        summary:
          "Experiment by the Space Robotics Group at the University of Bologna within the ESA REXUS sounding rocket program. It tested two-component polyurethane foam in a microgravity environment. The I-FOAM experiment tested shape-memory polymers during the STS-134 Space Shuttle mission in 2011. It confirms the physical feasibility of the concept, but the technology remains in the research phase.",
        stats: [],
        source: "ADS/Harvard — ui.adsabs.harvard.edu",
        url: "https://ui.adsabs.harvard.edu/abs/2013ESASP.723E.169R/abstract",
        correction: null,
      },
      {
        id: "clearspace1",
        tag: "ESA / ClearSpace SA · 2020–2028",
        title: "ClearSpace-1 — First Dedicated Debris Removal Mission",
        summary:
          "€86 million contract between ESA and the Swiss startup ClearSpace SA, a spin-off from EPFL, signed in November 2020. Original target: VESPA adapter, 112 kg, from 2013. In April 2024, the target was changed to the PROBA-1 satellite, 95 kg. It uses robotic arms for capture. Launch is expected around 2028, as previous 2025 dates were not met. It is the main market reference for commercial ADR missions.",
        stats: [
          { value: "€86M", label: "ESA–ClearSpace SA contract" },
          { value: "~2028", label: "expected launch, updated" },
          { value: "95 kg", label: "current target mass, PROBA-1" },
        ],
        source: "ESA — esa.int/Space_Safety/ClearSpace-1",
        url: "https://www.esa.int/Space_Safety/ClearSpace-1",
        correction: null,
      },
      {
        id: "removedebris",
        tag: "Univ. Surrey · 2018–2019",
        title: "RemoveDEBRIS — First In-Orbit Capture Demonstration",
        summary:
          "Mission funded by the European Union through the FP7 program and led by the University of Surrey. It was the first mission to demonstrate debris capture in orbit using a net in 2018 and a harpoon in February 2019, fired at 20 m/s from 20 meters away from the target. It established the technological precedent for active capture missions. Published in Acta Astronautica / ScienceDirect.",
        stats: [
          { value: "2018", label: "first net capture in orbit" },
          { value: "20 m/s", label: "harpoon firing speed" },
        ],
        source: "ScienceDirect — doi.org/10.1016/j.actaastro.2019.09.020",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0094576519312512",
        correction: null,
      },
      {
        id: "astroscale",
        tag: "Astroscale · 2021–2024",
        title: "Astroscale ELSA-d and ADRAS-J — Magnetic Capture and Inspection",
        summary:
          "ELSA-d, 2021: magnetic capture demonstration between a servicer and a client satellite equipped with a docking plate. ADRAS-J, 2024: first rendezvous and inspection of a real non-cooperative rocket stage, H-IIA F15, in orbit since 2009 — a historic milestone in ADR. The commercial ELSA-M service is planned to remove OneWeb satellites at end of life.",
        stats: [
          {
            value: "2024",
            label: "first inspection of non-cooperative debris, ADRAS-J",
          },
        ],
        source: "Astroscale — astroscale.com/en/missions",
        url: "https://www.astroscale.com/en/missions/elsa-d",
        correction: null,
      },
    ],
  },
];

export function getSections(language = "PT") {
  return language === "EN" ? SECTIONS_EN : SECTIONS_PT;
}
