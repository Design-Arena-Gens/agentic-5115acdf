export interface BirthData {
  date: string
  time: string
  latitude: number
  longitude: number
  location: string
}

export interface Planet {
  name: string
  longitude: number
  sign: string
  degree: number
  house: number
  symbol: string
  color: string
  description: string
}

export interface House {
  number: number
  cusp: number
  sign: string
}

export interface Aspect {
  planet1: string
  planet2: string
  type: string
  angle: number
  orb: number
}

export interface ChartData {
  birthData: BirthData
  planets: Planet[]
  houses: House[]
  aspects: Aspect[]
  ascendant: number
}
