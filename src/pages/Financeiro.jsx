import { useMemo, useState } from 'react';
import { PageHero } from '../components/ui.jsx';
import EconomiaOrbital from '../components/EconomiaOrbital/EconomiaOrbital.jsx';
import SimuladorFinanceiro from '../components/simuladorFinanceiro/SimuladorFinanceiro.jsx';
import CustosOrbitais from '../components/custosOrbitais/CustosOrbitais.jsx';
import ChamadaFinal from '../components/chamadaFinal/ChamadaFinal.jsx';

const Financeiro = () => {
    return(
        <>
            <EconomiaOrbital />
            <SimuladorFinanceiro />
            <CustosOrbitais />
            <ChamadaFinal />
        </>
         

    )
}

export default Financeiro