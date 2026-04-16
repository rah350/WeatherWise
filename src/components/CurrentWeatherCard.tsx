import type { CityLocation, WeatherSnapshot } from '../types/weather'
import {
  formatPercent,
  formatPressure,
  formatTemperature,
  formatVisibility,
  formatWind,
  getWeatherTheme,
  mapConditionToSymbol,
} from '../utils/weather'

interface CurrentWeatherCardProps {
  weather: WeatherSnapshot
  isSaved: boolean
  onToggleSaved: (city: CityLocation) => void
}

export function CurrentWeatherCard({
  weather,
  isSaved,
  onToggleSaved,
}: CurrentWeatherCardProps) {
  const currentCondition = weather.current.weather[0]

  return (
    <section className="city-card">
      <div className="city-card-header">
        <div>
          <span className="eyebrow">Live now</span>
          <h3>{weather.current.name}</h3>
          <p>{[weather.city.state, weather.current.sys.country].filter(Boolean).join(', ')}</p>
        </div>
        <button className="ghost-button" type="button" onClick={() => onToggleSaved(weather.city)}>
          {isSaved ? 'Remove saved city' : 'Save city'}
        </button>
      </div>

      <div className="temp-row">
        <div>
          <span className="weather-icon" aria-hidden="true">
            {mapConditionToSymbol(currentCondition?.id)}
          </span>
          <span className="temp-value">{formatTemperature(weather.current.main.temp, weather.units)}</span>
        </div>
        <div className="feels-like">
          <span className="metric-label">Feels like </span>
          <strong>{formatTemperature(weather.current.main.feels_like, weather.units)}</strong>
        </div>
      </div>

      <p>{getWeatherTheme(weather.current)}</p>

      <div className="detail-grid">
        <div className="detail-row">
          <span className="metric-label">Conditions</span>
          <strong>{currentCondition?.description ?? 'Unavailable'}</strong>
        </div>
        <div className="detail-row">
          <span className="metric-label">Humidity</span>
          <strong>{formatPercent(weather.current.main.humidity)}</strong>
        </div>
        <div className="detail-row">
          <span className="metric-label">Wind</span>
          <strong>{formatWind(weather.current.wind.speed, weather.units)}</strong>
        </div>
        <div className="detail-row">
          <span className="metric-label">Visibility</span>
          <strong>{formatVisibility(weather.current.visibility, weather.units)}</strong>
        </div>
        <div className="detail-row">
          <span className="metric-label">Pressure</span>
          <strong>{formatPressure(weather.current.main.pressure)}</strong>
        </div>
        <div className="detail-row">
          <span className="metric-label">Cloud cover</span>
          <strong>{formatPercent(weather.current.clouds.all)}</strong>
        </div>
      </div>
    </section>
  )
}
