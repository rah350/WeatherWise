const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

if (!apiKey) {
  throw new Error('Missing VITE_OPENWEATHER_API_KEY environment variable.')
}

export const OPEN_WEATHER_API_KEY = apiKey
