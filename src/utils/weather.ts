import type {
  AirPollutionApiResponse,
  ChartPoint,
  DailyForecast,
  ForecastApiResponse,
  ForecastItem,
  SavedCity,
  Units,
  WeatherApiResponse,
  WeatherVisualTheme,
} from '../types/weather'

export function formatTemperature(value: number, units: Units) {
  return `${Math.round(value)}°${units === 'imperial' ? 'F' : 'C'}`
}

export function formatWind(value: number, units: Units) {
  return `${Math.round(value)} ${units === 'imperial' ? 'mph' : 'm/s'}`
}

export function formatVisibility(value: number, units: Units) {
  const converted = units === 'imperial' ? value / 1609.34 : value / 1000
  return `${converted.toFixed(1)} ${units === 'imperial' ? 'mi' : 'km'}`
}

export function formatPressure(value: number) {
  return `${value} hPa`
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`
}

export function formatTime(timestamp: number, timezoneOffsetSeconds: number) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })

  return formatter.format(shiftDateByOffset(timestamp * 1000, timezoneOffsetSeconds))
}

export function formatDateLabel(
  dateText: string,
  timezoneOffsetSeconds: number,
  options?: Intl.DateTimeFormatOptions,
) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    ...options,
  })

  return formatter.format(shiftDateByOffset(Date.parse(dateText), timezoneOffsetSeconds))
}

export function buildChartData(forecast: ForecastApiResponse): ChartPoint[] {
  return forecast.list.slice(0, 8).map((item) => ({
    timeLabel: formatDateLabel(item.dt_txt, forecast.city.timezone, {
      weekday: undefined,
      month: undefined,
      day: undefined,
      hour: 'numeric',
    }),
    temperature: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    precipitationChance: Math.round(item.pop * 100),
  }))
}

export function buildDailyForecast(forecast: ForecastApiResponse): DailyForecast[] {
  const dailyBuckets = new Map<string, ForecastItem[]>()

  forecast.list.forEach((item) => {
    const dateKey = item.dt_txt.split(' ')[0]
    const entries = dailyBuckets.get(dateKey) ?? []
    entries.push(item)
    dailyBuckets.set(dateKey, entries)
  })

  return Array.from(dailyBuckets.entries())
    .slice(0, 5)
    .map(([dateKey, entries]) => {
      const representativeItem =
        entries.find((entry) => entry.dt_txt.includes('12:00:00')) ?? entries[Math.floor(entries.length / 2)]

      return {
        dayLabel: formatDateLabel(`${dateKey}T00:00:00`, forecast.city.timezone, {
          month: undefined,
          day: undefined,
          weekday: 'short',
        }),
        dateLabel: formatDateLabel(`${dateKey}T00:00:00`, forecast.city.timezone, {
          weekday: undefined,
          month: 'short',
          day: 'numeric',
        }),
        high: Math.max(...entries.map((entry) => entry.main.temp_max)),
        low: Math.min(...entries.map((entry) => entry.main.temp_min)),
        description: representativeItem.weather[0]?.description ?? 'Conditions unavailable',
        icon: mapConditionToSymbol(representativeItem.weather[0]?.id),
        humidity: representativeItem.main.humidity,
        precipitationChance: Math.max(...entries.map((entry) => entry.pop * 100)),
      }
    })
}

export function mapConditionToSymbol(conditionId?: number) {
  if (!conditionId) {
    return '•'
  }

  if (conditionId >= 200 && conditionId < 300) {
    return '⛈'
  }
  if (conditionId >= 300 && conditionId < 600) {
    return '🌧'
  }
  if (conditionId >= 600 && conditionId < 700) {
    return '❄'
  }
  if (conditionId >= 700 && conditionId < 800) {
    return '🌫'
  }
  if (conditionId === 800) {
    return '☀'
  }
  if (conditionId > 800) {
    return '☁'
  }

  return '•'
}

export function buildCityId(city: Pick<SavedCity, 'name' | 'country' | 'lat' | 'lon'>) {
  return `${city.name}-${city.country}-${city.lat.toFixed(2)}-${city.lon.toFixed(2)}`
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export function getAqiSummary(airQuality?: AirPollutionApiResponse) {
  const value = airQuality?.list[0]?.main.aqi

  switch (value) {
    case 1:
      return { label: 'Good', className: 'aqi-good' }
    case 2:
      return { label: 'Fair', className: 'aqi-good' }
    case 3:
      return { label: 'Moderate', className: 'aqi-moderate' }
    case 4:
      return { label: 'Poor', className: 'aqi-alert' }
    case 5:
      return { label: 'Very Poor', className: 'aqi-alert' }
    default:
      return { label: 'Unavailable', className: '' }
  }
}

export function getWeatherTheme(current: WeatherApiResponse) {
  const conditionId = current.weather[0]?.id ?? 800
  const localHour = new Date((current.dt + current.timezone) * 1000).getUTCHours()
  const isNight = localHour < 6 || localHour >= 18

  if (conditionId === 800 && !isNight) {
    return 'Clear skies and high visibility'
  }
  if (conditionId >= 200 && conditionId < 600) {
    return 'Rain-ready weather with shifting conditions'
  }
  if (conditionId >= 600 && conditionId < 700) {
    return 'Cold air moving through with wintry conditions'
  }
  if (conditionId >= 700 && conditionId < 800) {
    return 'Hazy atmosphere with reduced visibility'
  }
  if (isNight) {
    return 'Quiet evening conditions across the city'
  }

  return 'Layered clouds with steady neighborhood conditions'
}

export function getWeatherVisualTheme(current?: WeatherApiResponse): WeatherVisualTheme {
  if (!current) {
    return 'cloudy'
  }

  const conditionId = current.weather[0]?.id ?? 800
  const localHour = new Date((current.dt + current.timezone) * 1000).getUTCHours()
  const isNight = localHour < 6 || localHour >= 18

  if (conditionId >= 200 && conditionId < 300) {
    return 'storm'
  }
  if (conditionId >= 300 && conditionId < 600) {
    return 'rain'
  }
  if (conditionId >= 600 && conditionId < 700) {
    return 'snow'
  }
  if (conditionId >= 700 && conditionId < 800) {
    return 'mist'
  }
  if (conditionId === 800 && !isNight) {
    return 'sunny'
  }
  if (conditionId === 800 && isNight) {
    return 'night'
  }

  return 'cloudy'
}

function shiftDateByOffset(timestampMs: number, offsetSeconds: number) {
  return new Date(timestampMs + offsetSeconds * 1000)
}
