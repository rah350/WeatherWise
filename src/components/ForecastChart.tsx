import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WeatherSnapshot } from '../types/weather'
import { buildChartData } from '../utils/weather'

interface ForecastChartProps {
  weather: WeatherSnapshot
}

export function ForecastChart({ weather }: ForecastChartProps) {
  const chartData = buildChartData(weather.forecast)

  return (
    <section className="chart-panel">
      <div className="section-header">
        <div>
          <span className="eyebrow">Trendline</span>
          <h3 className="section-title">Next 24 hours</h3>
          <p className="section-copy">Compare air temperature and feels-like temperature in one view.</p>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tempFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#69d2ff" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#69d2ff" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="feelsFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffcb77" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#ffcb77" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(212, 235, 255, 0.08)" vertical={false} />
            <XAxis dataKey="timeLabel" stroke="#a9bfd6" tickLine={false} axisLine={false} />
            <YAxis stroke="#a9bfd6" tickLine={false} axisLine={false} width={32} />
            <Tooltip
              contentStyle={{
                borderRadius: 18,
                border: '1px solid rgba(212, 235, 255, 0.18)',
                backgroundColor: 'rgba(8, 25, 43, 0.94)',
                color: '#f4f8ff',
              }}
            />
            <Area type="monotone" dataKey="feelsLike" stroke="#ffcb77" fill="url(#feelsFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="temperature" stroke="#69d2ff" fill="url(#tempFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
