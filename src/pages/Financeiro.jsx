import { useMemo, useState } from 'react';
import { PageHero } from '../components/ui.jsx';
import EconomiaOrbital from '../components/EconomiaOrbital/EconomiaOrbital.jsx';
import SimuladorFinanceiro from '../components/simuladorFinanceiro/SimuladorFinanceiro.jsx';
import CustosOrbitais from '../components/custosOrbitais/CustosOrbitais.jsx';

const Financeiro = () => {
    return(
        <>
            <EconomiaOrbital />
            <SimuladorFinanceiro />
            <CustosOrbitais />

        </>
         

    )
}

export default Financeiro