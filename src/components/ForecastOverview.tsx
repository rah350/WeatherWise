import type { WeatherSnapshot } from '../types/weather'
import { buildDailyForecast, formatPercent, formatTemperature } from '../utils/weather'

interface ForecastOverviewProps {
  weather: WeatherSnapshot
}

export function ForecastOverview({ weather }: ForecastOverviewProps) {
  const forecast = buildDailyForecast(weather.forecast)

  return (
    <section className="surface">
      <div className="section-header">
        <div>
          <span className="eyebrow">Forecast</span>
          <h3 className="section-title">Five-day outlook</h3>
          <p className="section-copy">Daily highs, lows, and storm chances from the OpenWeather forecast feed.</p>
        </div>
      </div>

      <div className="forecast-grid">
        {forecast.map((day) => (
          <article className="forecast-card" key={`${day.dayLabel}-${day.dateLabel}`}>
            <strong>{day.dayLabel}</strong>
            <p>{day.dateLabel}</p>
            <div className="forecast-icon" aria-hidden="true">
              {day.icon}
            </div>
            <p>{day.description}</p>
            <div className="detail-row">
              <span className="metric-label">High</span>
              <strong>{formatTemperature(day.high, weather.units)}</strong>
            </div>
            <div className="detail-row">
              <span className="metric-label">Low</span>
              <strong>{formatTemperature(day.low, weather.units)}</strong>
            </div>
            <div className="detail-row">
              <span className="metric-label">Rain chance</span>
              <strong>{formatPercent(day.precipitationChance)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
