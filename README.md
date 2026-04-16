# WeatherWise Weather Dashboard

WeatherWise is a single-page weather dashboard built for an IS 542 semester project. It uses React, TypeScript, React Router, and the OpenWeather API to provide live conditions, a five-day forecast, a 24-hour trend chart, location search, saved cities, and responsive city detail views.

## Project Description

This project demonstrates:

- React functional components with hooks
- Full TypeScript typing with strict mode enabled
- Real API integration using the OpenWeather free tier
- Route-based navigation with React Router
- Error, loading, and retry states for API requests
- Persistent saved cities using local storage
- Responsive layouts for desktop and mobile
- A third-party charting library (`recharts`) for weather trends

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Create an environment file based on the example:

```bash
cp .env.example .env
```

3. Add your OpenWeather API key:

```env
VITE_OPENWEATHER_API_KEY=your_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## API Used and Data Handling

This app uses the OpenWeather API free tier:

- Geocoding API for city search
- Current Weather API for live conditions
- 5 Day / 3 Hour Forecast API for forecast visualization
- Air Pollution API for AQI highlights

Data flow summary:

- Search results come from the geocoding endpoint.
- Selecting a city triggers current weather, forecast, and air quality requests.
- Saved cities and unit preferences are stored in local storage.
- The app shows loading, error, and retry states for request failures.
- Saved city snapshots refresh in the background for quick comparisons.

## Additional Features

- Current location lookup through the browser geolocation API
- Dedicated saved-cities route
- Individual saved-city detail route
- Reusable custom `useLocalStorage` hook
- Typed formatting and forecast transformation utilities
- Responsive glassmorphism-inspired interface

## Deployment

This project is ready to deploy on Vercel, Netlify, or GitHub Pages after adding the `VITE_OPENWEATHER_API_KEY` environment variable in your hosting platform settings.
