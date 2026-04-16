import { useCallback, useEffect, useState } from 'react'
import { fetchWeatherBundle, searchCities } from '../services/openWeather'
import type {
  CityLocation,
  SavedCity,
  SearchState,
  Units,
  WeatherSnapshot,
} from '../types/weather'
import { buildCityId } from '../utils/weather'
import { useLocalStorage } from './useLocalStorage'

const DEFAULT_CITY: CityLocation = {
  name: 'Denver',
  state: 'Colorado',
  country: 'US',
  lat: 39.7392,
  lon: -104.9903,
}

const DEFAULT_SEARCH_STATE: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  error: null,
}

export function useWeatherDashboard() {
  const [units, setUnits] = useLocalStorage<Units>('weather-units', 'imperial')
  const [savedCities, setSavedCities] = useLocalStorage<SavedCity[]>('weather-saved-cities', [])
  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITY)
  const [activeWeather, setActiveWeather] = useState<WeatherSnapshot | null>(null)
  const [savedSnapshots, setSavedSnapshots] = useState<Record<string, WeatherSnapshot>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshingSaved, setIsRefreshingSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchState, setSearchState] = useState<SearchState>(DEFAULT_SEARCH_STATE)

  const loadCity = useCallback(async (location: CityLocation) => {
    setIsLoading(true)
    setError(null)

    try {
      const bundle = await fetchWeatherBundle(location, units)
      const city: SavedCity = { ...location, id: buildCityId(location) }
      const snapshot: WeatherSnapshot = {
        id: city.id,
        city,
        units,
        ...bundle,
      }

      setSelectedCity(location)
      setActiveWeather(snapshot)
      setSavedSnapshots((current) => ({
        ...current,
        [snapshot.id]: snapshot,
      }))
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load weather data.')
    } finally {
      setIsLoading(false)
    }
  }, [units])

  useEffect(() => {
    void loadCity(selectedCity)
  }, [loadCity, selectedCity])

  useEffect(() => {
    if (savedCities.length === 0) {
      setSavedSnapshots({})
      return
    }

    const refreshSavedCities = async () => {
      setIsRefreshingSaved(true)

      try {
        const snapshots = await Promise.all(
          savedCities.map(async (city) => {
            const bundle = await fetchWeatherBundle(city, units)
            return [
              city.id,
              {
                id: city.id,
                city,
                units,
                ...bundle,
              } satisfies WeatherSnapshot,
            ] as const
          }),
        )

        setSavedSnapshots((current) => {
          const next = { ...current }

          snapshots.forEach(([id, snapshot]) => {
            next[id] = snapshot
          })

          return next
        })
      } catch {
        // Saved city tiles still render using the last successful fetch.
      } finally {
        setIsRefreshingSaved(false)
      }
    }

    void refreshSavedCities()
  }, [savedCities, units])

  function searchForCity(query: string) {
    setSearchState((current) => ({
      ...current,
      query,
    }))

    if (!query.trim()) {
      setSearchState(DEFAULT_SEARCH_STATE)
      return
    }

    setSearchState((current) => ({
      ...current,
      query,
      isSearching: true,
      error: null,
    }))

    void searchCities(query)
      .then((results) => {
        setSearchState({
          query,
          results,
          isSearching: false,
          error: results.length === 0 ? 'No cities matched that search.' : null,
        })
      })
      .catch((caughtError) => {
        setSearchState({
          query,
          results: [],
          isSearching: false,
          error: caughtError instanceof Error ? caughtError.message : 'Search failed.',
        })
      })
  }

  function selectSearchResult(city: CityLocation) {
    setSearchState(DEFAULT_SEARCH_STATE)
    void loadCity(city)
  }

  function toggleSavedCity(city: CityLocation) {
    const normalizedCity: SavedCity = {
      ...city,
      id: buildCityId(city),
    }

    setSavedCities((current) => {
      const alreadySaved = current.some((entry) => entry.id === normalizedCity.id)

      if (alreadySaved) {
        return current.filter((entry) => entry.id !== normalizedCity.id)
      }

      return [normalizedCity, ...current].slice(0, 8)
    })
  }

  function isCitySaved(city: CityLocation) {
    const cityId = buildCityId(city)
    return savedCities.some((entry) => entry.id === cityId)
  }

  function refreshActiveCity() {
    void loadCity(selectedCity)
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: CityLocation = {
          name: 'Your location',
          country: 'Local',
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }

        void loadCity(location)
      },
      () => {
        setError('We could not access your current location.')
        setIsLoading(false)
      },
    )
  }

  return {
    units,
    setUnits,
    savedCities,
    activeWeather,
    savedSnapshots,
    isLoading,
    isRefreshingSaved,
    error,
    searchState,
    searchForCity,
    selectSearchResult,
    toggleSavedCity,
    isCitySaved,
    refreshActiveCity,
    useCurrentLocation,
  }
}
