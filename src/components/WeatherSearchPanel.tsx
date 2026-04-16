import type { FormEvent } from 'react'
import type { CityLocation, SearchState, Units } from '../types/weather'

interface WeatherSearchPanelProps {
  units: Units
  searchState: SearchState
  onToggleUnits: (units: Units) => void
  onSearch: (query: string) => void
  onSelectCity: (city: CityLocation) => void
  onUseLocation: () => void
}

export function WeatherSearchPanel({
  units,
  searchState,
  onToggleUnits,
  onSearch,
  onSelectCity,
  onUseLocation,
}: WeatherSearchPanelProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(searchState.query)
  }

  return (
    <section className="surface search-panel">
      <div className="split-header">
        <div>
          <span className="eyebrow">Search</span>
          <h3>Find a city</h3>
          <p>Search anywhere in the world, switch units, or jump to your current location.</p>
        </div>
        <div className="toggle-group" aria-label="Temperature units">
          <button
            type="button"
            className={units === 'imperial' ? 'active' : ''}
            onClick={() => onToggleUnits('imperial')}
          >
            Fahrenheit
          </button>
          <button
            type="button"
            className={units === 'metric' ? 'active' : ''}
            onClick={() => onToggleUnits('metric')}
          >
            Celsius
          </button>
        </div>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <label className="search-field">
          <span className="sr-only">Search by city name</span>
          <input
            type="text"
            value={searchState.query}
            placeholder="Search Denver, Tokyo, Cape Town..."
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <button className="cta-button" type="submit">
          Search
        </button>
        <button className="ghost-button" type="button" onClick={onUseLocation}>
          Use my location
        </button>
      </form>

      {(searchState.isSearching || searchState.error || searchState.results.length > 0) && (
        <div className="search-results" aria-live="polite">
          {searchState.isSearching && <p>Searching locations...</p>}
          {searchState.error && !searchState.isSearching && <p>{searchState.error}</p>}
          {!searchState.isSearching &&
            searchState.results.map((result) => (
              <button
                key={`${result.name}-${result.lat}-${result.lon}`}
                type="button"
                className="search-result-item"
                onClick={() => onSelectCity(result)}
              >
                <div>
                  <strong>{result.name}</strong>
                  <p>{[result.state, result.country].filter(Boolean).join(', ')}</p>
                </div>
                <span className="chip">View</span>
              </button>
            ))}
        </div>
      )}
    </section>
  )
}
