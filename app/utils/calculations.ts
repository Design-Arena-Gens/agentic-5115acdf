import * as Astronomy from 'astronomy-engine'
import { BirthData, ChartData, Planet, House, Aspect } from '../types'

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const PLANET_INFO: Record<string, { symbol: string; color: string; description: string }> = {
  Sun: { symbol: '☉', color: '#FDB813', description: 'Core identity, ego, vitality' },
  Moon: { symbol: '☽', color: '#C0C0C0', description: 'Emotions, instincts, habits' },
  Mercury: { symbol: '☿', color: '#87CEEB', description: 'Communication, intellect, reasoning' },
  Venus: { symbol: '♀', color: '#FF69B4', description: 'Love, beauty, values, pleasure' },
  Mars: { symbol: '♂', color: '#DC143C', description: 'Action, desire, energy, courage' },
  Jupiter: { symbol: '♃', color: '#FF8C00', description: 'Expansion, luck, philosophy, growth' },
  Saturn: { symbol: '♄', color: '#8B4513', description: 'Discipline, responsibility, structure' },
  Uranus: { symbol: '♅', color: '#00CED1', description: 'Innovation, rebellion, uniqueness' },
  Neptune: { symbol: '♆', color: '#9370DB', description: 'Dreams, spirituality, illusion' },
  Pluto: { symbol: '♇', color: '#8B0000', description: 'Transformation, power, regeneration' }
}

function getZodiacSign(longitude: number): string {
  const index = Math.floor(longitude / 30)
  return ZODIAC_SIGNS[index % 12]
}

function getDegreeInSign(longitude: number): number {
  return longitude % 30
}

function normalizeAngle(angle: number): number {
  angle = angle % 360
  if (angle < 0) angle += 360
  return angle
}

function calculateHouseNumber(planetLongitude: number, houses: House[]): number {
  planetLongitude = normalizeAngle(planetLongitude)

  for (let i = 0; i < houses.length; i++) {
    const currentHouse = houses[i]
    const nextHouse = houses[(i + 1) % houses.length]

    let cusp1 = normalizeAngle(currentHouse.cusp)
    let cusp2 = normalizeAngle(nextHouse.cusp)

    if (cusp2 < cusp1) {
      if (planetLongitude >= cusp1 || planetLongitude < cusp2) {
        return currentHouse.number
      }
    } else {
      if (planetLongitude >= cusp1 && planetLongitude < cusp2) {
        return currentHouse.number
      }
    }
  }

  return 1
}

function calculateAspects(planets: Planet[]): Aspect[] {
  const aspects: Aspect[] = []
  const aspectTypes = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 8 },
    { name: 'Square', angle: 90, orb: 7 },
    { name: 'Sextile', angle: 60, orb: 6 }
  ]

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]

      let diff = Math.abs(planet1.longitude - planet2.longitude)
      if (diff > 180) diff = 360 - diff

      for (const aspectType of aspectTypes) {
        const orb = Math.abs(diff - aspectType.angle)
        if (orb <= aspectType.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectType.name,
            angle: aspectType.angle,
            orb: orb
          })
          break
        }
      }
    }
  }

  return aspects
}

export function calculateNatalChart(birthData: BirthData): ChartData {
  const [year, month, day] = birthData.date.split('-').map(Number)
  const [hours, minutes] = birthData.time.split(':').map(Number)

  const birthDate = new Date(Date.UTC(year, month - 1, day, hours, minutes))

  const observer = new Astronomy.Observer(
    birthData.latitude,
    birthData.longitude,
    0
  )

  // Calculate planetary positions
  const planetNames: Astronomy.Body[] = [
    Astronomy.Body.Sun,
    Astronomy.Body.Moon,
    Astronomy.Body.Mercury,
    Astronomy.Body.Venus,
    Astronomy.Body.Mars,
    Astronomy.Body.Jupiter,
    Astronomy.Body.Saturn,
    Astronomy.Body.Uranus,
    Astronomy.Body.Neptune,
    Astronomy.Body.Pluto
  ]

  // Calculate ascendant (simplified using sidereal time)
  const hourAngle = (hours + minutes / 60) * 15
  const lst = (hourAngle + birthData.longitude) % 360
  const ascendant = normalizeAngle(lst + 90)

  // Calculate houses using Placidus system (simplified)
  const houses: House[] = []
  for (let i = 0; i < 12; i++) {
    const cuspAngle = normalizeAngle(ascendant + (i * 30))
    houses.push({
      number: i + 1,
      cusp: cuspAngle,
      sign: getZodiacSign(cuspAngle)
    })
  }

  const planets: Planet[] = planetNames.map(body => {
    // Get geocentric position vector
    const position = Astronomy.GeoVector(body, birthDate, false)

    // Convert to ecliptic coordinates
    const eclipticCoords = Astronomy.Ecliptic(position)
    const longitude = normalizeAngle(eclipticCoords.elon)

    const sign = getZodiacSign(longitude)
    const degree = getDegreeInSign(longitude)
    const name = Astronomy.Body[body]
    const info = PLANET_INFO[name]

    return {
      name,
      longitude,
      sign,
      degree,
      house: 0, // Will be calculated after
      symbol: info.symbol,
      color: info.color,
      description: info.description
    }
  })

  // Calculate house placements for planets
  planets.forEach(planet => {
    planet.house = calculateHouseNumber(planet.longitude, houses)
  })

  const aspects = calculateAspects(planets)

  return {
    birthData,
    planets,
    houses,
    aspects,
    ascendant
  }
}
