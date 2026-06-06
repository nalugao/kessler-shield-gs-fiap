import Navbar from "./Navbar";
import Footer from "./Footer";
import AccessibilityMenu from "./Acessibilidade/AccessibilityMenu";
import './layout.css'

import { Outlet } from "react-router-dom"

function Layout(){
   return(
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        <Footer />
        <AccessibilityMenu />
    </>
   )
}

export default Layout;
