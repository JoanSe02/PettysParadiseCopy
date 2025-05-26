"use client"

import { useState, useEffect } from "react"
import { X, Cookie, Settings } from "lucide-react"
import "../stylos/Cookies.css"

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [marketingEnabled, setMarketingEnabled] = useState(false)

   const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Solo acceder a localStorage después de montar el componente
    const hasConsent = localStorage.getItem("cookie-consent")
    if (!hasConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookie-consent", "all")
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    localStorage.setItem("cookie-consent", "essential")
    setIsVisible(false)
  }

  const handleSaveSettings = () => {
    const settings = {
      essential: true,
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
    }
    localStorage.setItem("cookie-consent", JSON.stringify(settings))
    setIsVisible(false)
    setShowSettings(false)
  }

  const toggleAnalytics = () => setAnalyticsEnabled(!analyticsEnabled)
  const toggleMarketing = () => setMarketingEnabled(!marketingEnabled)

  if (!isMounted || !isVisible) return null

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner-card">
        <div className="cookie-banner-content">
          <div className="cookie-banner-header">
            <div className="cookie-banner-icon">
              <Cookie />
            </div>

            <div className="cookie-banner-body">
              <h3 className="cookie-banner-title">Configuración de Cookies</h3>

              <p className="cookie-banner-description">
                Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y
                personalizar el contenido. Puedes aceptar todas las cookies o configurar tus preferencias.
              </p>

              {!showSettings ? (
                <div className="cookie-banner-buttons">
                  <button onClick={handleAcceptAll} className="cookie-banner-button cookie-banner-button-primary">
                    Aceptar todas
                  </button>

                  <button onClick={handleRejectAll} className="cookie-banner-button cookie-banner-button-secondary">
                    Solo esenciales
                  </button>

                  <button
                    onClick={() => setShowSettings(true)}
                    className="cookie-banner-button cookie-banner-button-outline"
                  >
                    <Settings />
                    Configurar
                  </button>
                </div>
              ) : (
                <div className="cookie-banner-settings">
                  <div className="cookie-banner-settings-grid">
                    {/* Cookies Esenciales */}
                    <div className="cookie-banner-setting-item essential">
                      <div className="cookie-banner-setting-content">
                        <div className="cookie-banner-setting-info">
                          <h4>Cookies Esenciales</h4>
                          <p>Necesarias para el funcionamiento básico del sitio</p>
                        </div>
                        <button className="cookie-banner-toggle essential">
                          <div className="cookie-banner-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    {/* Cookies de Análisis */}
                    <div className="cookie-banner-setting-item optional">
                      <div className="cookie-banner-setting-content">
                        <div className="cookie-banner-setting-info">
                          <h4>Cookies de Análisis</h4>
                          <p>Nos ayudan a entender cómo usas nuestro sitio</p>
                        </div>
                        <button
                          onClick={toggleAnalytics}
                          className={`cookie-banner-toggle ${analyticsEnabled ? "enabled" : "disabled"}`}
                        >
                          <div className="cookie-banner-toggle-thumb" />
                        </button>
                      </div>
                    </div>

                    {/* Cookies de Marketing */}
                    <div className="cookie-banner-setting-item optional">
                      <div className="cookie-banner-setting-content">
                        <div className="cookie-banner-setting-info">
                          <h4>Cookies de Marketing</h4>
                          <p>Para mostrarte contenido personalizado</p>
                        </div>
                        <button
                          onClick={toggleMarketing}
                          className={`cookie-banner-toggle ${marketingEnabled ? "enabled" : "disabled"}`}
                        >
                          <div className="cookie-banner-toggle-thumb" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cookie-banner-settings-buttons">
                    <button onClick={handleSaveSettings} className="cookie-banner-button cookie-banner-button-primary">
                      Guardar configuración
                    </button>

                    <button
                      onClick={() => setShowSettings(false)}
                      className="cookie-banner-button cookie-banner-button-secondary"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}

              <div className="cookie-banner-footer">
                <p>
                  Para más información, consulta nuestra <a href="/privacy">Política de Privacidad</a> y{" "}
                  <a href="/cookies">Política de Cookies</a>
                </p>
              </div>
            </div>

            <button onClick={() => setIsVisible(false)} className="cookie-banner-close">
              <X />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


