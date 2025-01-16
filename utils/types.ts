// types.ts
export type NonGoldResourceType = 'upgradeOre' // Пример типа ресурса, можно добавить другие типы

export interface Resource {
  type: NonGoldResourceType
  amount: number
}

export type LevelRequirements = Record<number, {
  resourses: Resource[]
  goldCost: number
}>

export type StatExtra = Record<number, string | number>
export interface StatProgression {
  values: number[]
  incrementPerLevel?: number
  extra?: StatExtra
  promote: number[]
}

export type StatType = 'heroDefense' | 'heroHP' | 'boostHeroHP' | 'boostHeroDefense' | 'magicDamageResistance' | 'heroAttack' | 'criticalHitRate' | 'boostHeroAttack'

export type StatsProgression = Partial<Record<StatType, StatProgression>>

export type EquipmentStats = Partial<Record<StatType, number>>

export type StarsStats = Record<string, Record<number, EquipmentStats>>

export interface Equipment {
  id: string
  name: string
  slot: string
  rarity: string
  statsProgression: StatsProgression
}

export type LevelStats = Record<string, number | string>

export interface TableData {
  head: string[]
  rows: TableRow[]
}

export interface TableRowData {
  id: string
  value: number | string
}

export interface TableRowExtra {
  id: string
  value: string
}

export interface TableRow {
  name: string
  data: TableRowData[]
  extra?: TableRowExtra[]
}
