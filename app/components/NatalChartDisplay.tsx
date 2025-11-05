'use client'

import { useState } from 'react'
import { ChartData, Planet } from '../types'

interface Props {
  chartData: ChartData | null
}

interface TooltipData {
  content: string
  x: number
  y: number
}

export default function NatalChartDisplay({ chartData }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  if (!chartData) {
    return (
      <div className="chart-card">
        <div className="placeholder">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1"/>
          </svg>
          <h3>Your natal chart will appear here</h3>
          <p>Enter your birth details to generate your personalized chart</p>
        </div>
      </div>
    )
  }

  const centerX = 300
  const centerY = 300
  const outerRadius = 280
  const innerRadius = 200
  const planetRadius = 240

  const polarToCartesian = (angle: number, radius: number) => {
    const radian = ((angle - 90) * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    }
  }

  const showTooltip = (planet: Planet, event: React.MouseEvent) => {
    const rect = (event.currentTarget as SVGElement).getBoundingClientRect()
    setTooltip({
      content: `
        <div class="tooltip-title">${planet.symbol} ${planet.name}</div>
        <div class="tooltip-info">
          Position: ${planet.degree.toFixed(2)}° ${planet.sign}<br/>
          House: ${planet.house}<br/>
          ${planet.description}
        </div>
      `,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  const hideTooltip = () => {
    setTooltip(null)
  }

  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', start: 0 },
    { name: 'Taurus', symbol: '♉', start: 30 },
    { name: 'Gemini', symbol: '♊', start: 60 },
    { name: 'Cancer', symbol: '♋', start: 90 },
    { name: 'Leo', symbol: '♌', start: 120 },
    { name: 'Virgo', symbol: '♍', start: 150 },
    { name: 'Libra', symbol: '♎', start: 180 },
    { name: 'Scorpio', symbol: '♏', start: 210 },
    { name: 'Sagittarius', symbol: '♐', start: 240 },
    { name: 'Capricorn', symbol: '♑', start: 270 },
    { name: 'Aquarius', symbol: '♒', start: 300 },
    { name: 'Pisces', symbol: '♓', start: 330 }
  ]

  return (
    <div className="chart-card">
      <h2>Your Natal Chart</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {chartData.birthData.location} • {chartData.birthData.date} • {chartData.birthData.time}
      </p>

      <div className="chart-container">
        <svg viewBox="0 0 600 600" className="chart-svg">
          {/* Outer circle */}
          <circle cx={centerX} cy={centerY} r={outerRadius} className="outer-circle" />

          {/* Inner circle */}
          <circle cx={centerX} cy={centerY} r={innerRadius} className="inner-circle" />

          {/* Zodiac sign boundaries */}
          {zodiacSigns.map((sign) => {
            const angle = sign.start - chartData.ascendant
            const outerPoint = polarToCartesian(angle, outerRadius)
            const innerPoint = polarToCartesian(angle, innerRadius)
            return (
              <line
                key={sign.name}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                className="sign-boundary"
              />
            )
          })}

          {/* Zodiac sign symbols */}
          {zodiacSigns.map((sign) => {
            const angle = sign.start + 15 - chartData.ascendant
            const point = polarToCartesian(angle, (outerRadius + innerRadius) / 2)
            return (
              <text
                key={`symbol-${sign.name}`}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="24"
                fill="#666"
              >
                {sign.symbol}
              </text>
            )
          })}

          {/* House lines */}
          {chartData.houses.map((house) => {
            const angle = house.cusp - chartData.ascendant
            const outerPoint = polarToCartesian(angle, innerRadius)
            const innerPoint = polarToCartesian(angle, 0)
            return (
              <line
                key={house.number}
                x1={innerPoint.x}
                y1={innerPoint.y}
                x2={outerPoint.x}
                y2={outerPoint.y}
                className="house-line"
              />
            )
          })}

          {/* House numbers */}
          {chartData.houses.map((house, idx) => {
            const nextHouse = chartData.houses[(idx + 1) % 12]
            const angle = ((house.cusp + nextHouse.cusp) / 2) - chartData.ascendant
            const point = polarToCartesian(angle, innerRadius * 0.6)
            return (
              <text
                key={`house-num-${house.number}`}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fill="#999"
                fontWeight="bold"
              >
                {house.number}
              </text>
            )
          })}

          {/* Aspects */}
          {chartData.aspects.map((aspect, idx) => {
            const planet1 = chartData.planets.find(p => p.name === aspect.planet1)
            const planet2 = chartData.planets.find(p => p.name === aspect.planet2)
            if (!planet1 || !planet2) return null

            const angle1 = planet1.longitude - chartData.ascendant
            const angle2 = planet2.longitude - chartData.ascendant
            const point1 = polarToCartesian(angle1, innerRadius * 0.9)
            const point2 = polarToCartesian(angle2, innerRadius * 0.9)

            return (
              <line
                key={`aspect-${idx}`}
                x1={point1.x}
                y1={point1.y}
                x2={point2.x}
                y2={point2.y}
                className={`aspect-line aspect-${aspect.type.toLowerCase()}`}
              />
            )
          })}

          {/* Planets */}
          {chartData.planets.map((planet) => {
            const angle = planet.longitude - chartData.ascendant
            const point = polarToCartesian(angle, planetRadius)

            return (
              <g
                key={planet.name}
                className="planet"
                onMouseEnter={(e) => showTooltip(planet, e)}
                onMouseLeave={hideTooltip}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="18"
                  fill={planet.color}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fill="white"
                  fontWeight="bold"
                >
                  {planet.symbol}
                </text>
              </g>
            )
          })}

          {/* Ascendant marker */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + outerRadius}
            y2={centerY}
            stroke="#ff0000"
            strokeWidth="3"
          />
          <text
            x={centerX + outerRadius + 15}
            y={centerY}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize="14"
            fill="#ff0000"
            fontWeight="bold"
          >
            ASC
          </text>
        </svg>

        {tooltip && (
          <div
            className="tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />
        )}
      </div>

      <div className="legend">
        <h3>Planets</h3>
        <div className="legend-grid">
          {chartData.planets.map((planet) => (
            <div key={planet.name} className="legend-item">
              <div className="legend-color" style={{ background: planet.color }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  {planet.symbol}
                </span>
              </div>
              <span>{planet.name} in {planet.sign}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
