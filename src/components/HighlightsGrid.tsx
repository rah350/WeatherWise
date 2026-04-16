import type { WeatherSnapshot } from '../types/weather'
import {
  formatPercent,
  formatPressure,
  formatTime,
  formatVisibility,
  getAqiSummary,
} from '../utils/weather'

interface HighlightsGridProps {
  weather: WeatherSnapshot
}

export function HighlightsGrid({ weather }: HighlightsGridProps) {
  const aqiSummary = getAqiSummary(weather.airQuality)

  return (
    <section className="surface">
      <div className="section-header">
        <div>
          <span className="eyebrow">Atmospherics</span>
          <h3 className="section-title">Planning highlights</h3>
          <p className="section-copy">A focused readout of the conditions most people check before heading out.</p>
        </div>
      </div>

      <div className="highlights-grid">
        <article>
          <p className="highlight-label">Sunrise</p>
          <strong className="highlight-value">{formatTime(weather.current.sys.sunrise, weather.current.timezone)}</strong>
          <p className="subtle">Local solar time</p>
        </article>
        <article>
          <p className="highlight-label">Sunset</p>
          <strong className="highlight-value">{formatTime(weather.current.sys.sunset, weather.current.timezone)}</strong>
          <p className="subtle">Great light for evening plans</p>
        </article>
        <article>
          <p className="highlight-label">Air quality</p>
          <strong className={`highlight-value ${aqiSummary.className}`}>{aqiSummary.label}</strong>
          <p className="subtle">OpenWeather AQI index</p>
        </article>
        <article>
          <p className="highlight-label">Pressure</p>
          <strong className="highlight-value">{formatPressure(weather.current.main.pressure)}</strong>
          <p className="subtle">Useful for trend watching</p>
        </article>
        <article>
          <p className="highlight-label">Cloud cover</p>
          <strong className="highlight-value">{formatPercent(weather.current.clouds.all)}</strong>
          <p className="subtle">Sky visibility</p>
        </article>
        <article>
          <p className="highlight-label">Visibility</p>
          <strong className="highlight-value">{formatVisibility(weather.current.visibility, weather.units)}</strong>
          <p className="subtle">Travel confidence</p>
        </article>
        <article>
          <p className="highlight-label">Humidity</p>
          <strong className="highlight-value">{formatPercent(weather.current.main.humidity)}</strong>
          <p className="subtle">Comfort indicator</p>
        </article>
        <article>
          <p className="highlight-label">Rain signal</p>
          <strong className="highlight-value">{formatPercent((weather.forecast.list[0]?.pop ?? 0) * 100)}</strong>
          <p className="subtle">From the next forecast interval</p>
        </article>
      </div>
    </section>
  )
}
