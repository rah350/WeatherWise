import { Link, Navigate, useParams } from 'react-router-dom'
import { ForecastChart } from '../components/ForecastChart'
import { ForecastOverview } from '../components/ForecastOverview'
import { HighlightsGrid } from '../components/HighlightsGrid'
import { StatusMessage } from '../components/StatusMessage'
import type { useWeatherDashboard } from '../hooks/useWeatherDashboard'
import { formatTemperature } from '../utils/weather'

interface CityDetailsPageProps {
  weather: ReturnType<typeof useWeatherDashboard>
}

export function CityDetailsPage({ weather }: CityDetailsPageProps) {
  const { cityId } = useParams()

  if (!cityId || !weather.savedCities.some((city) => city.id === cityId)) {
    return <Navigate to="/saved" replace />
  }

  const cityWeather = weather.savedSnapshots[cityId]

  if (!cityWeather) {
    return (
      <StatusMessage
        title="Loading saved city details"
        message="The latest conditions for this city are still being fetched."
      />
    )
  }

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div>
          <span className="eyebrow">City detail</span>
          <h2>{cityWeather.city.name}</h2>
          <p className="page-lead">
            {[cityWeather.city.state, cityWeather.city.country].filter(Boolean).join(', ')}
          </p>
          <div className="detail-meta">
            <div className="stat-chip">
              <span className="metric-label">Current</span>
              <strong>{formatTemperature(cityWeather.current.main.temp, cityWeather.units)}</strong>
              <span>{cityWeather.current.weather[0]?.main}</span>
            </div>
            <div className="stat-chip">
              <span className="metric-label">Feels like</span>
              <strong>{formatTemperature(cityWeather.current.main.feels_like, cityWeather.units)}</strong>
              <span>Local perception</span>
            </div>
          </div>
        </div>

        <div className="toolbar">
          <Link className="ghost-button" to="/saved">
            Back to saved cities
          </Link>
          <button className="icon-button" type="button" onClick={() => weather.toggleSavedCity(cityWeather.city)}>
            Remove city
          </button>
        </div>
      </section>

      <ForecastChart weather={cityWeather} />
      <ForecastOverview weather={cityWeather} />
      <HighlightsGrid weather={cityWeather} />
    </div>
  )
}
