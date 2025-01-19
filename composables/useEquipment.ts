// Constants
export const EQUIPMENT_CONSTANTS = {
  MAX_STARS: 5,
  MAX_LEVEL: 40,
} as const

// Base data
const baseStats: BaseStats = {
  imperial: {
    boots: {
      0: {
        heroDefense: 40,
        heroHP: 10500,
        boostHeroHP: 2.50,
        boostHeroDefense: 2.50,
        heroDefenseIncrement: 5.94,
        heroHPIncrement: 940.64,
        boostHeroHPIncrement: 0.1249,
        boostHeroDefenseIncrement: 0.1249,
      },
      1: {
        heroDefense: 50,
        heroHP: 11550,
      },
      2: {
        heroDefense: 60,
        heroHP: 12750,
      },
      3: {
        heroDefense: 80,
        heroHP: 14000,
      },
      4: {
        heroDefense: 100,
        heroHP: 16500,
      },
      5: {
        heroDefense: 120,
        heroHP: 18800,
      },
    },
  },
}

const levelUpgrade: LevelUpgrade = {
  imperial: [
    { min: 0, max: 4, coin: 225000, upgradeOre: 1500 },
    { min: 4, max: 8, coin: 337500, upgradeOre: 2200 },
    { min: 8, max: 12, coin: 450000, upgradeOre: 3000 },
    { min: 12, max: 16, coin: 562500, upgradeOre: 3700 },
    { min: 16, max: 20, coin: 675000, upgradeOre: 4500 },
    { min: 20, max: 23, coin: 787500, upgradeOre: 5200 },
    { min: 24, max: 27, coin: 900000, upgradeOre: 6000 },
    { min: 27, max: 30, coin: 1000000, upgradeOre: 6700 },
    { min: 30, max: 36, coin: 1100000, upgradeOre: 7500 },
    { min: 36, max: 40, coin: 1200000, upgradeOre: 8200 },
  ],
}

export type StatValue = number | string
export type StatCalculator = (baseValue: number, level: number) => StatValue

/**
 * Formats stat value based on whether it's a percentage or not
 */
function formatStatValue(value: number, isPercentage: boolean): StatValue {
  return isPercentage ? `+${value.toFixed(2)}%` : Math.round(value)
}

/**
 * Creates a calculator function for a specific stat type
 */
function createStatCalculator(increment: number, isPercentage: boolean): StatCalculator {
  return (baseValue: number, level: number): StatValue =>
    formatStatValue(baseValue + increment * level, isPercentage)
}

/**
 * Creates a map of stat calculators for the given equipment
 */
function useStatCalculators(equipment: Ref<Equipment>,	activeStar: Ref<number>) {
  return computed(() => {
    const calculators = new Map<StatType, StatCalculator>()
    const starStats = baseStats[equipment.value.rarity]?.[equipment.value.slot]
    if (!starStats)
      return calculators

    // Get stat increment for the current star level
    const getStatIncrement = (statType: StatType): number => {
      for (let i = activeStar.value; i >= 0; i--) {
        const increment = starStats[i]?.[`${statType}Increment`]
        if (increment !== undefined)
          return increment
      }
      return 0
    }

    // Initialize calculators for each stat type
    for (const statType of Object.keys(starStats[0] || {}) as StatType[]) {
      if (!statType.includes('Increment')) {
        const increment = getStatIncrement(statType)
        const isPercentage = statType.includes('boost')
        calculators.set(statType, createStatCalculator(increment, isPercentage))
      }
    }

    return calculators
  })
}

/**
 * Gets base stats for the current equipment and star level
 */
function useBaseStats(equipment: Ref<Equipment>,	activeStar: Ref<number>) {
  const stats = computed((): Record<StatType, number> => {
    const result: Partial<Record<StatType, number>> = {}
    const starStats = baseStats[equipment.value.rarity]?.[equipment.value.slot]

    if (!starStats)
      return result as Record<StatType, number>

    for (let i = 0; i <= activeStar.value; i++) {
      const currentStats = starStats[i] || {}
      const previousStats = i > 0 ? starStats[i - 1] || {} : {}

      // Add current level stats
      Object.entries(currentStats)
        .filter(([key]) => !key.includes('Increment'))
        .forEach(([key, value]) => {
          result[key as StatType] = value as number
        })

      // Fallback to previous level stats if missing
      Object.entries(previousStats)
        .filter(([key]) => !key.includes('Increment') && !(key in currentStats))
        .forEach(([key, value]) => {
          result[key as StatType] = value as number
        })
    }

    return result as Record<StatType, number>
  })

  return {
    stats,
  }
}

/**
 * Handles level requirements calculations
 */
function useLevelRequirements(equipment: Ref<Equipment>,	isPromoted: Ref<boolean>) {
  const calculateRequirements = (level: number): Resource[] => {
    if (isPromoted.value)
      return []

    const rarity = equipment.value.rarity
    const upgrades = levelUpgrade[rarity]
    if (!upgrades)
      return []

    const range = upgrades.find((range: LevelRequirements) =>
      level >= range.min && level <= range.max,
    ) ?? upgrades[upgrades.length - 1]

    if (!range)
      return []

    return Object.entries(range)
      .filter(([key]) => key !== 'min' && key !== 'max')
      .map(([material, amount]) => ({
        material: material as ResourseMaterial,
        amount: amount as number,
      }))
  }

  return {
    calculateRequirements,
  }
}

/**
 * Handles extra attributes calculations
 */
function useExtraAttributes(equipment: Ref<Equipment>,	isPromoted: Ref<boolean>) {
  const getAttributes = (level: number): TableRowExtra[] => {
    const starLevel = isPromoted.value ? (level + 1) * 10 : level
    const extraKey = `lv_${starLevel}`

    return Object.entries(equipment.value.statsProgression)
      .filter(([, progression]) => progression?.extra?.[extraKey] !== undefined)
      .map(([stat, progression]) => {
        const value = progression!.extra![extraKey]
        const formattedValue = typeof value === 'string' && value.includes('.')
          ? value.endsWith('%') ? value : `${value}%`
          : value.toString()

        return {
          id: makeCamelCase(stat),
          value: formattedValue,
        }
      })
  }

  return {
    getAttributes,
  }
}

/**
 * Main equipment composable
 */
export default function useEquipment(initialEquipment: Equipment) {
  const equipment = ref<Equipment>(initialEquipment)
  const activeStar = ref<number>(0)
  const isPromoted = ref<boolean>(false)

  // Initialize sub-composables with reactive refs
  const { stats } = useBaseStats(equipment, activeStar)
  const { calculateRequirements } = useLevelRequirements(equipment, isPromoted)
  const { getAttributes } = useExtraAttributes(equipment, isPromoted)
  const calculators = useStatCalculators(equipment, activeStar)

  // Create table data
  const tableData = computed((): TableData => {
    const iterations = isPromoted.value
      ? EQUIPMENT_CONSTANTS.MAX_STARS - 1
      : EQUIPMENT_CONSTANTS.MAX_LEVEL

    const currentStats = stats.value
    const currentCalculators = calculators.value
    const rows: TableRow[] = []

    for (let i = 0; i <= iterations; i++) {
      const data: TableRowData[] = []
      const requirements = calculateRequirements(i)
      const extra = getAttributes(i)

      // Add base stats
      Object.entries(currentStats).forEach(([statType, baseValue]) => {
        const calculator = currentCalculators.get(statType as StatType)
        if (calculator) {
          data.push({
            id: makeCamelCase(statType),
            value: calculator(baseValue, i),
          })
        }
      })

      // Add progression stats
      Object.entries(equipment.value.statsProgression)
        .filter(([, progression]) => progression && !progression.extra)
        .forEach(([statType]) => {
          const baseValue = currentStats[statType as StatType] || 0
          const calculator = currentCalculators.get(statType as StatType)
          if (calculator) {
            data.push({
              id: makeCamelCase(statType),
              value: calculator(baseValue, i),
            })
          }
        })

      // Add requirements
      requirements.forEach((resource) => {
        data.push({
          id: makeCamelCase(resource.material),
          value: resource.amount,
        })
      })

      rows.push({
        name: isPromoted.value ? `${i + 1}` : `Level ${i}`,
        data,
        ...(extra.length > 0 ? { extra } : {}),
      })
    }

    const columns = new Set<string>(
      rows.flatMap(row => row.data.map(item => item.id)),
    )

    return {
      head: [isPromoted.value ? 'Stars' : 'Level', ...Array.from(columns)],
      rows,
    }
  })

  // Computed properties
  const canPromote = computed(() =>
    equipment.value.rarity === 'imperial'
    && activeStar.value === EQUIPMENT_CONSTANTS.MAX_STARS
    && !isPromoted.value,
  )

  // Methods
  const updateEquipment = (newEquipment: Equipment) => {
    equipment.value = newEquipment
    isPromoted.value = false
  }

  const promote = () => {
    if (canPromote.value) {
      isPromoted.value = true
    }
  }

  return {
    tableData,
    updateEquipment,
    activeStar,
    canPromote,
    promote,
    isPromoted,
  }
}
