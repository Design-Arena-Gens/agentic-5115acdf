'use client'

import { useState } from 'react'
import { ChartData } from '../types'
import { calculateNatalChart } from '../utils/calculations'

interface Props {
  onGenerate: (data: ChartData) => void
}

export default function NatalChartForm({ onGenerate }: Props) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    latitude: '',
    longitude: '',
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const chartData = calculateNatalChart({
      date: formData.date,
      time: formData.time,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      location: formData.location
    })

    onGenerate(chartData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const useExampleData = () => {
    setFormData({
      date: '1990-06-15',
      time: '14:30',
      latitude: '40.7128',
      longitude: '-74.0060',
      location: 'New York, NY'
    })
  }

  return (
    <div className="form-card">
      <h2>Birth Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Birth Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Birth Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., New York, NY"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            placeholder="e.g., 40.7128"
            step="0.0001"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            placeholder="e.g., -74.0060"
            step="0.0001"
            value={formData.longitude}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-generate">
          Generate Chart
        </button>

        <button
          type="button"
          onClick={useExampleData}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '10px',
            background: 'transparent',
            border: '2px solid #667eea',
            color: '#667eea',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Use Example Data
        </button>
      </form>
    </div>
  )
}
