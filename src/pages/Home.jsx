import Contato from "../components/home/Contato"
import Equipe from "../components/home/Equipe"
import Financeiro from "../components/home/Financeiro"
import Hero from "../components/home/Hero"
import Problema from "../components/home/Problema"
import Referencias from "../components/home/ReferenciasSection"
import Simulador from "../components/home/Simulador"
import Solucao from "../components/home/Solucao"
import ContactCTASection from '../components/contact/ContactCTASection'

const Home = () => {
  return (
    <main>
        <Hero />
        <Simulador />
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