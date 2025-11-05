'use client'

import { useState } from 'react'
import NatalChartForm from './components/NatalChartForm'
import NatalChartDisplay from './components/NatalChartDisplay'
import { ChartData } from './types'

export default function Home() {
  const [chartData, setChartData] = useState<ChartData | null>(null)

  return (
    <div className="container">
      <header className="header">
        <h1>✨ Natal Chart Generator ✨</h1>
        <p>Discover your cosmic blueprint based on your birth details</p>
      </header>

      <div className="content">
        <NatalChartForm onGenerate={setChartData} />
        <NatalChartDisplay chartData={chartData} />
      </div>
    </div>
  )
}
