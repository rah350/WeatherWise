import { Link } from 'react-router-dom'
import { CurrentWeatherCard } from '../components/CurrentWeatherCard'
import { ForecastChart } from '../components/ForecastChart'
import { ForecastOverview } from '../components/ForecastOverview'
import { HighlightsGrid } from '../components/HighlightsGrid'
import { SavedCitiesGrid } from '../components/SavedCitiesGrid'
import { StatusMessage } from '../components/StatusMessage'
import { WeatherSearchPanel } from '../components/WeatherSearchPanel'
import type { useWeatherDashboard } from '../hooks/useWeatherDashboard'
import { formatTemperature, formatWind } from '../utils/weather'

interface DashboardPageProps {
  weather: ReturnType<typeof useWeatherDashboard>
}

export function DashboardPage({ weather }: DashboardPageProps) {
  const activeWeather = weather.activeWeather

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          {/* <span className="eyebrow">Semester project</span> */}
          <h2>Weather that helps you decide what comes next.</h2>
          <p>
            WeatherWise combines live conditions, short-term trends, and saved city comparisons in a single responsive dashboard built with React, TypeScript, and OpenWeather.
          </p>

          {activeWeather && (
            <div className="quick-stats">
              <div className="stat-chip">
                <span className="metric-label">Current temperature</span>
                <strong>{formatTemperature(activeWeather.current.main.temp, activeWeather.units)}</strong>
                <span>{activeWeather.current.weather[0]?.main}</span>
              </div>
              <div className="stat-chip">
                <span className="metric-label">Wind speed</span>
                <strong>{formatWind(activeWeather.current.wind.speed, activeWeather.units)}</strong>
                <span>{activeWeather.current.name}</span>
              </div>
              <div className="stat-chip">
                <span className="metric-label">Saved cities</span>
                <strong>{weather.savedCities.length}</strong>
                <span>Persistent in local storage</span>
              </div>
            </div>
          )}

          <div className="hero-actions">
            <a className="cta-button" href="#dashboard-content">
              Explore dashboard
            </a>
            <Link className="ghost-button" to="/saved">
              Open saved cities
            </Link>
          </div>
        </div>

        <div className="hero-aside">
          {activeWeather ? (
            <CurrentWeatherCard
              weather={activeWeather}
              isSaved={weather.isCitySaved(activeWeather.city)}
              onToggleSaved={weather.toggleSavedCity}
            />
          ) : (
            <StatusMessage title="Loading current city" message="Fetching the first weather snapshot..." />
          )}
        </div>
      </section>

      <section className="dashboard-grid" id="dashboard-content">
        <WeatherSearchPanel
          units={weather.units}
          searchState={weather.searchState}
          onToggleUnits={weather.setUnits}
          onSearch={weather.searchForCity}
          onSelectCity={weather.selectSearchResult}
          onUseLocation={weather.useCurrentLocation}
        />

        {weather.error ? (
          <StatusMessage
            title="Weather feed error"
            message={weather.error}
            actionLabel="Retry current city"
            onAction={weather.refreshActiveCity}
          />
        ) : weather.isLoading || !activeWeather ? (
          <StatusMessage title="Loading forecast" message="Pulling current conditions and the five-day forecast..." />
        ) : (
          <ForecastChart weather={activeWeather} />
        )}
      </section>

      {activeWeather && !weather.error && (
        <>
          <ForecastOverview weather={activeWeather} />
          <HighlightsGrid weather={activeWeather} />
        </>
      )}

      <section className="surface">
        <div className="section-header saved-toolbar">
          <div>
            <span className="eyebrow">Saved places</span>
            <h3 className="section-title">Quick comparison board</h3>
            <p className="section-copy">Compare your pinned cities at a glance and reopen any city detail view from here.</p>
          </div>
          {weather.isRefreshingSaved && <span className="chip">Refreshing saved cities</span>}
        </div>

        <SavedCitiesGrid
          savedCities={weather.savedCities}
          snapshots={weather.savedSnapshots}
          onToggleSaved={weather.toggleSavedCity}
        />
      </section>
    </div>
  )
}
