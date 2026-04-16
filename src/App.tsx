import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { useWeatherDashboard } from './hooks/useWeatherDashboard'
import { CityDetailsPage } from './pages/CityDetailsPage'
import { DashboardPage } from './pages/DashboardPage'
import { SavedCitiesPage } from './pages/SavedCitiesPage'
import { getWeatherVisualTheme } from './utils/weather'

function App() {
  const weather = useWeatherDashboard()
  const visualTheme = getWeatherVisualTheme(weather.activeWeather?.current)

  return (
    <AppLayout savedCitiesCount={weather.savedCities.length} visualTheme={visualTheme}>
      <Routes>
        <Route path="/" element={<DashboardPage weather={weather} />} />
        <Route path="/saved" element={<SavedCitiesPage weather={weather} />} />
        <Route path="/city/:cityId" element={<CityDetailsPage weather={weather} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
