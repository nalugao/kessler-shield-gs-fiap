export default function Narrator({ sim }) {
  const { display, fleets, removal } = sim;
  const live = display?.live;
  const c = live?.systemCriticality ?? 0;
  const rows = display?.history ?? [];

  const diverged = rows.some(
    (r) => r.high != null && r.ghost_high != null && r.ghost_high - r.high > 80,
  );

  let text;
  let tone = "muted";

  if (fleets > 0 && diverged && removal >= 6) {
    text = "Você desviou a trajetória. A órbita deixa de entrar em cascata.";
    tone = "safe";
  } else if (fleets > 0 && diverged) {
    text = "Intervenção insuficiente — implante mais frotas ou a cascata continua.";
    tone = "warn";
  } else if (fleets > 0) {
    text = "Frotas no ar. Veja as linhas se separarem no gráfico de detritos.";
    tone = "warn";
  } else if (c >= 1.15) {
    text =
      "Sem intervenção, lançar satélites deixa de ser viável — a órbita está intransitável.";
    tone = "danger";
  } else if (c >= 1) {
    text =
      "Passamos do limite. Cada colisão gera mais lixo do que o arrasto consegue remover.";
    tone = "warn";
  } else {
    text = "Constelações enchem o céu. O relógio corre.";
    tone = "muted";
  }

  return (
    <p className={"narrator tone-" + tone} role="status">
      {text}
    </p>
  );
}
