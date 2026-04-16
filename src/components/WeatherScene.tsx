import type { CSSProperties } from 'react'
import type { WeatherVisualTheme } from '../types/weather'

interface WeatherSceneProps {
  theme: WeatherVisualTheme
}

const rainDrops = Array.from({ length: 18 }, (_, index) => index)
const snowFlakes = Array.from({ length: 16 }, (_, index) => index)
const stars = Array.from({ length: 14 }, (_, index) => index)
const clouds = Array.from({ length: 4 }, (_, index) => index)

export function WeatherScene({ theme }: WeatherSceneProps) {
  return (
    <div className={`weather-scene weather-scene-${theme}`} aria-hidden="true">
      <div className="weather-glow" />
      {(theme === 'rain' || theme === 'storm') && (
        <div className="rain-layer">
          {rainDrops.map((drop) => (
            <span
              key={`rain-${drop}`}
              className="rain-drop"
              style={
                {
                  '--left': `${(drop * 7) % 100}%`,
                  '--delay': `${(drop % 6) * 0.35}s`,
                  '--duration': `${0.9 + (drop % 5) * 0.18}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {theme === 'storm' && <div className="lightning-flash" />}

      {theme === 'snow' && (
        <div className="snow-layer">
          {snowFlakes.map((flake) => (
            <span
              key={`snow-${flake}`}
              className="snow-flake"
              style={
                {
                  '--left': `${(flake * 9) % 100}%`,
                  '--delay': `${(flake % 5) * 0.5}s`,
                  '--duration': `${4.8 + (flake % 4) * 0.8}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {theme === 'sunny' && (
        <>
          <div className="sun-orb" />
          <div className="sun-ring" />
        </>
      )}

      {(theme === 'cloudy' || theme === 'mist' || theme === 'night') && (
        <div className="cloud-layer">
          {clouds.map((cloud) => (
            <span
              key={`cloud-${cloud}`}
              className="cloud-puff"
              style={
                {
                  '--top': `${18 + cloud * 12}%`,
                  '--left': `${8 + cloud * 22}%`,
                  '--delay': `${cloud * 1.1}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {theme === 'mist' && <div className="mist-band" />}

      {theme === 'night' && (
        <div className="star-layer">
          {stars.map((star) => (
            <span
              key={`star-${star}`}
              className="star-dot"
              style={
                {
                  '--top': `${8 + ((star * 13) % 35)}%`,
                  '--left': `${6 + ((star * 17) % 88)}%`,
                  '--delay': `${(star % 6) * 0.55}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
