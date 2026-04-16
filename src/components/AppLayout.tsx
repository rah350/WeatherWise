import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'
import type { WeatherVisualTheme } from '../types/weather'
import { WeatherScene } from './WeatherScene'

interface AppLayoutProps extends PropsWithChildren {
  savedCitiesCount: number
  visualTheme: WeatherVisualTheme
}

export function AppLayout({ children, savedCitiesCount, visualTheme }: AppLayoutProps) {
  return (
    <div className={`app-shell theme-${visualTheme}`}>
      <WeatherScene theme={visualTheme} />
      <header className="site-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            WX
          </div>
          <div className="brand-text">
            <h1>WeatherWise</h1>
            <p>OpenWeather powered planning dashboard</p>
          </div>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink className="nav-link" to="/">
            Dashboard
          </NavLink>
          <NavLink className="nav-link" to="/saved">
            Saved Cities ({savedCitiesCount})
          </NavLink>
        </nav>
      </header>

      <main className="layout-content">{children}</main>
      <p className="footer-note">Built with React, TypeScript, React Router, Recharts, and OpenWeather.</p>
    </div>
  )
}
