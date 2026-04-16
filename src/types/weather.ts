export type Units = 'imperial' | 'metric'
export type WeatherVisualTheme = 'sunny' | 'rain' | 'storm' | 'snow' | 'mist' | 'cloudy' | 'night'

export interface CityLocation {
  name: string
  state?: string
  country: string
  lat: number
  lon: number
}

export interface SavedCity extends CityLocation {
  id: string
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherApiResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: WeatherCondition[]
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  name: string
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    humidity: number
    pressure: number
  }
  weather: WeatherCondition[]
  wind: {
    speed: number
  }
  pop: number
  visibility: number
  dt_txt: string
}

export interface ForecastApiResponse {
  list: ForecastItem[]
  city: {
    name: string
    country: string
    timezone: number
    sunrise: number
    sunset: number
    coord: {
      lat: number
      lon: number
    }
  }
}

export interface AirPollutionApiResponse {
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no: number
      no2: number
      o3: number
      so2: number
      pm2_5: number
      pm10: number
      nh3: number
    }
  }>
}

export interface ChartPoint {
  timeLabel: string
  temperature: number
  feelsLike: number
  precipitationChance: number
}

export interface DailyForecast {
  dayLabel: string
  dateLabel: string
  high: number
  low: number
  description: string
  icon: string
  humidity: number
  precipitationChance: number
}

export interface WeatherSnapshot {
  id: string
  city: SavedCity
  units: Units
  current: WeatherApiResponse
  forecast: ForecastApiResponse
  airQuality?: AirPollutionApiResponse
}

export interface SearchState {
  query: string
  results: CityLocation[]
  isSearching: boolean
  error: string | null
}
