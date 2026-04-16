import { SavedCitiesGrid } from '../components/SavedCitiesGrid'
import type { useWeatherDashboard } from '../hooks/useWeatherDashboard'

interface SavedCitiesPageProps {
  weather: ReturnType<typeof useWeatherDashboard>
}

export function SavedCitiesPage({ weather }: SavedCitiesPageProps) {
  return (
    <div className="page-stack">
      <section className="surface">
        <span className="eyebrow">Saved cities</span>
        <h2 className="page-title">Your persistent forecast board</h2>
        <p className="page-lead">
          This route showcases React Router, local storage persistence, and reusable weather cards across the application.
        </p>
      </section>

      <SavedCitiesGrid
        savedCities={weather.savedCities}
        snapshots={weather.savedSnapshots}
        onToggleSaved={weather.toggleSavedCity}
      />
    </div>
  )
}
