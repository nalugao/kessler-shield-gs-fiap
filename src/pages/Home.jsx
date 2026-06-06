import Contato from "../components/home/ContatoSection"
import Equipe from "../components/home/Equipe"
import Financeiro from "../components/home/Financeiro"
import Hero from "../components/home/Hero"
import Problema from "../components/home/Problema"
import Referencias from "../components/home/ReferenciasSection"
import Solucao from "../components/home/Solucao"

const Home = () => {
  return (
    <main>
        <Hero />
        <Problema />
        <Solucao />
        <Financeiro />
        <Referencias />
        <Contato />
        <Equipe />
    </main>
  )
}

export default Home