import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"

import Login from "../pages/Login.jsx"
import Registrar from "../pages/Registrar.jsx"
import RecuperarContraseña from "../pages/RecuperarContraseña.jsx"
import Header from "../componentes/Header.jsx"
import Footer from "../componentes/Footer.jsx"
import PropietarioDashboard from "../pages/PropietarioDashboard"
import PrivateRoutePropietario from "./PrivateRoutePropietario"
import AdministradorDashboard from "../pages/AdministradorDashboard.jsx"
import PrivateRouteAdministrador from "./PrivateRouteAdministrador.jsx"
import VeterinarioDashboard from "../pages/VeterinarioDashbord.jsx"
import PrivateRouteVeterinario from "./PrivateRouteVeterinario.jsx"
import Loading from "../pages/Loading.jsx"
import InfoMas from "../pages/InfoMas.jsx"
import NotFound from "../pages/NotFound.jsx"
import Mascotas from "../pages/Mascotas.jsx"
import Citas from "../pages/Citas.jsx"
import Nosotros from "../componentes/Nosotros.jsx"
import CookieBanner from "../pages/Cookies.jsx"


const Home = lazy(() => import("../componentes/Home"))

const AppRoutes = () => {
  console.log("AppRoutes renderizado") // Debug

  return (
    <>
      {/* Componente de debug temporal */}
  

      <Routes>
        {/* Ruta Home con Header y Footer */}
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading fullPage={true} />}>
              <>
                <Header />
                <Home />
                <Footer />
              </>
            </Suspense>
          }
        />

        <Route
          path="/nosotros"
          element={
            <Suspense fallback={<Loading fullPage={true} />}>
              <>
                <Header />
                <Nosotros />
                <Footer />
              </>
            </Suspense>
          }
        />

        {/* Rutas sin Header y Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/recuperar" element={<RecuperarContraseña />} />

        {/* RUTA PRIVADA PARA PROPIETARIOS */}
        <Route element={<PrivateRoutePropietario />}>
          <Route path="/propietario" element={<PropietarioDashboard />} />
          <Route path="/propietario/infomas" element={<InfoMas />} />
          <Route path="/propietario/mascotas" element={<Mascotas />} />
          <Route path="/propietario/citas" element={<Citas />} />
        </Route>

        {/* RUTAS PRIVADAS PARA ADMINISTRADORES */}
        <Route element={<PrivateRouteAdministrador />}>
          <Route path="/administrador" element={<AdministradorDashboard />} />
          <Route path="/administrador/usuarios" element={<InfoMas />} />
          <Route path="/administrador/veterinarios" element={<InfoMas />} />
          <Route path="/administrador/mascotas" element={<Mascotas />} />
          <Route path="/administrador/configuracion" element={<InfoMas />} />
        </Route>

        {/* RUTAS PRIVADAS PARA VETERINARIOS */}
        <Route element={<PrivateRouteVeterinario />}>
          <Route path="/veterinario" element={<VeterinarioDashboard />} />
          <Route path="/veterinario/citas" element={<Citas />} />
          <Route path="/veterinario/pacientes" element={<Mascotas />} />
          <Route path="/veterinario/historiales" element={<InfoMas />} />
          <Route path="/veterinario/configuracion" element={<InfoMas />} />
        </Route>

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </>
  )
}

export default AppRoutes




