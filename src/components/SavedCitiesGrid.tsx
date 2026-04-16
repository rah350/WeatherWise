import { Link } from 'react-router-dom'
import type { SavedCity, WeatherSnapshot } from '../types/weather'
import { formatTemperature, mapConditionToSymbol } from '../utils/weather'

interface SavedCitiesGridProps {
  savedCities: SavedCity[]
  snapshots: Record<string, WeatherSnapshot>
  onToggleSaved: (city: SavedCity) => void
}

export function SavedCitiesGrid({
  savedCities,
  snapshots,
  onToggleSaved,
}: SavedCitiesGridProps) {
  if (savedCities.length === 0) {
    return (
      <section className="empty-state">
        <strong>No saved cities yet</strong>
        <p>Save a city from the dashboard to build a quick comparison board here.</p>
      </section>
    )
  }

  return (
    <section className="saved-grid">
      {savedCities.map((city) => {
        const snapshot = snapshots[city.id]

        return (
          <article key={city.id}>
            <div className="saved-card-head">
              <div>
                <strong className="saved-city-name">{city.name}</strong>
                <p>{[city.state, city.country].filter(Boolean).join(', ')}</p>
              </div>
              <span className="weather-icon" aria-hidden="true">
                {mapConditionToSymbol(snapshot?.current.weather[0]?.id)}
              </span>
            </div>

            <div className="saved-card-body">
              <div>
                <span className="metric-label">Current</span>
                <strong className="saved-temp">
                  {snapshot ? formatTemperature(snapshot.current.main.temp, snapshot.units) : '--'}
                </strong>
              </div>
              <div>
                <span className="metric-label">Conditions </span>
                <strong>{snapshot?.current.weather[0]?.main ?? 'Loading'}</strong>
              </div>
            </div>

            <div className="saved-card-actions">
              <Link className="ghost-button" to={`/city/${city.id}`}>
                View details
              </Link>
              <button className="icon-button" type="button" onClick={() => onToggleSaved(city)}>
                Remove
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
