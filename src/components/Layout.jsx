import Navbar from "./Navbar";
import Footer from "./Footer";
import AccessibilityMenu from "./Acessibilidade/AccessibilityMenu";
import './layout.css'
import { useLocation } from "react-router-dom";

import { Outlet } from "react-router-dom"

function Layout() {
    const location = useLocation()
    const currentPath = location.pathname
    const isSimulation = currentPath == "/simulador"
    console.log(isSimulation)
    return (
        <>
            {isSimulation ? <></> : <Navbar />}
            <main>
                <Outlet />
            </main>

            {isSimulation ? <></> : <Footer />}
            <AccessibilityMenu />
        </>
    )
}

export default Layout;
