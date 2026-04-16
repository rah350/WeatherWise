import { OPEN_WEATHER_API_KEY } from '../config'
import type {
  AirPollutionApiResponse,
  CityLocation,
  ForecastApiResponse,
  Units,
  WeatherApiResponse,
} from '../types/weather'

const API_ROOT = 'https://api.openweathermap.org'

class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchJson<T>(path: string, query: Record<string, string | number>) {
  const url = new URL(`${API_ROOT}${path}`)

  Object.entries({
    ...query,
    appid: OPEN_WEATHER_API_KEY,
  }).forEach(([key, value]) => {
    url.searchParams.set(key, String(value))
  })

  const response = await fetch(url.toString())

  if (!response.ok) {
    const message =
      response.status === 404
        ? 'We could not find weather data for that location.'
        : 'Weather data is temporarily unavailable. Please try again.'

    throw new ApiError(message)
  }

  return (await response.json()) as T
}

export function searchCities(query: string) {
  return fetchJson<CityLocation[]>('/geo/1.0/direct', {
    q: query,
    limit: 5,
  })
}

export function fetchCurrentWeather(location: Pick<CityLocation, 'lat' | 'lon'>, units: Units) {
  return fetchJson<WeatherApiResponse>('/data/2.5/weather', {
    lat: location.lat,
    lon: location.lon,
    units,
  })
}

export function fetchForecast(location: Pick<CityLocation, 'lat' | 'lon'>, units: Units) {
  return fetchJson<ForecastApiResponse>('/data/2.5/forecast', {
    lat: location.lat,
    lon: location.lon,
    units,
  })
}

export function fetchAirQuality(location: Pick<CityLocation, 'lat' | 'lon'>) {
  return fetchJson<AirPollutionApiResponse>('/data/2.5/air_pollution', {
    lat: location.lat,
    lon: location.lon,
  })
}

export async function fetchWeatherBundle(location: CityLocation, units: Units) {
  const [current, forecast, airQuality] = await Promise.all([
    fetchCurrentWeather(location, units),
    fetchForecast(location, units),
    fetchAirQuality(location).catch(() => undefined),
  ])

  return {
    current,
    forecast,
    airQuality,
  }
}
