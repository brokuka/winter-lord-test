export type ResourseMaterial = 'upgradeOre' | 'coin'

export type EquipmentRarity = 'imperial' | 'royal'

export type EquimpentSlot = 'boots' | 'sword' | 'gauntlet' | 'armor'

export type StatType =
  | 'heroDefense'
  | 'heroHP'
  | 'boostHeroHP'
  | 'boostHeroDefense'
  | 'magicDamageResistance'
  | 'heroAttack'
  | 'criticalHitRate'
  | 'boostHeroAttack'

export type StatTypeWithIncrement = `${StatType}Increment`

export interface Resource {
  material: ResourseMaterial
  amount: number
}

export type TableLevelRequirements = Record<number, {
  resourses: Resource[]
  goldCost: number
}>

export type StatExtra = Record<string, string | number>
export interface StatProgression {
  values: number[]
  incrementPerLevel?: number
  extra?: StatExtra
  promote: number[]
}

export type StatsProgression = Partial<Record<StatType, StatProgression>>

export type EquipmentStats = Partial<Record<StatType, number>>
export type EquipmentStatsWithIncrement = EquipmentStats & Partial<Record<StatTypeWithIncrement, number>>

export type BaseStats = Partial<Record<EquipmentRarity, Partial<Record<EquimpentSlot, Record<number, EquipmentStatsWithIncrement>>>>>

export interface Equipment {
  id: string
  name: string
  slot: EquimpentSlot
  rarity: EquipmentRarity
  statsProgression: StatsProgression
}

export type LevelRequirements = {
  min: number
  max: number
} & Partial<Record<ResourseMaterial, number>>

export type LevelUpgrade = Partial<Record<EquipmentRarity, LevelRequirements[]>>
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
