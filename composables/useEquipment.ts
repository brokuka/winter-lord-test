const starsStats: StarsStats = {
  imperial: {
    boots: {
      0: {
        heroDefense: 40,
        heroHP: 10500,
        boostHeroHP: 2.50,
        boostHeroDefense: 2.50,
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

export default function useEquipment(initialEquipment: Equipment) {
  const equipment = ref<Equipment>(initialEquipment)
  const activeStar = ref<number>(0)
  const isPromoted = ref<boolean>(false)
  const maxStars = 5
  const maxLevel = 40

  // Форматирование имени стата
  const formatName = (stat: string, reverse: boolean = false): string => {
    if (reverse) {
      return stat
        .split(' ')
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join('')
    }

    return stat
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  }

  // Получение базовых статов с учётом звёзд
  const getBaseStats = (): Record<StatType, number> => {
    const stats: Record<StatType, number> = {} as Record<StatType, number>

    for (let i = 0; i <= activeStar.value; i++) {
      const starStats = starsStats[equipment.value.rarity]?.[equipment.value.slot]?.[i] || {}
      Object.entries(starStats).forEach(([stat, value]) => {
        const statType = stat as StatType
        stats[statType] = value
      })
    }

    return stats
  }

  // Расчет значения стата на конкретном уровне
  const calculateStatValue = (
    baseValue: number,
    statType: StatType,
    currentLevel: number,
  ): number | string => {
    let increment = 0
    switch (statType) {
      case 'heroDefense':
        increment = 5.94 * currentLevel
        break
      case 'heroHP':
        increment = 940.6 * currentLevel
        break
      case 'boostHeroHP':
      case 'boostHeroDefense':
        increment = 0.1249 * currentLevel
        break
    }
    if (statType === 'boostHeroHP' || statType === 'boostHeroDefense') {
      return `+${Number(Math.round((baseValue + increment) * 100) / 100).toFixed(2)}%`
    }
    return Math.round(baseValue + increment)
  }

  // Расчет требований для уровня
  const calculateLevelRequirements = (level: number): Resource[] => {
    if (isPromoted.value)
      return []

    const range = levelUpgrade[equipment.value.rarity]?.find(range =>
      level >= range.min && level <= range.max,
    ) ?? levelUpgrade[equipment.value.rarity]?.[levelUpgrade[equipment.value.rarity]!.length - 1]

    if (!range)
      return []

    return Object.entries(range)
      .filter(([key]) => key !== 'min' && key !== 'max')
      .map(([key, value]) => ({
        material: key as ResourseMaterial,
        amount: value as number,
      }))
  }

  // Получение дополнительных атрибутов
  const getExtraAttributes = (level: number): TableRowExtra[] => {
    const extra: TableRowExtra[] = []
    const starLevel = isPromoted.value ? (level + 1) * 10 : level
    const extraKey = `lv_${starLevel}`

    Object.entries(equipment.value.statsProgression).forEach(([stat, progression]) => {
      if (progression?.extra?.[extraKey] !== undefined) {
        const value = progression.extra[extraKey]
        const formattedValue = typeof value === 'string' && value.includes('.')
          ? value.endsWith('%') ? value : `${value}%`
          : value.toString()
        extra.push({
          id: formatName(stat),
          value: formattedValue,
        })
      }
    })

    return extra
  }

  // Преобразование в данные таблицы
  const equipmentToTableData = (eq: Equipment): TableData => {
    const rows: TableRow[] = []
    const iterations = isPromoted.value ? maxStars - 1 : maxLevel
    const baseStats = getBaseStats()

    for (let i = 0; i <= iterations; i++) {
      const data: TableRowData[] = []

      Object.entries(baseStats).forEach(([statType, baseValue]) => {
        const value = calculateStatValue(baseValue, statType as StatType, i)
        data.push({
          id: formatName(statType),
          value,
        })
      })

      Object.entries(eq.statsProgression).forEach(([statType, progression]) => {
        if (progression && !progression.extra) {
          const baseValue = baseStats[statType as StatType] || 0
          const value = calculateStatValue(baseValue, statType as StatType, i)
          data.push({
            id: formatName(statType),
            value,
          })
        }
      })

      const requirements = calculateLevelRequirements(i)
      requirements.forEach((resource) => {
        data.push({
          id: formatName(resource.material),
          value: resource.amount,
        })
      })

      const extra = getExtraAttributes(i)

      rows.push({
        name: isPromoted.value ? `${i + 1}` : `Level ${i}`,
        data,
        ...(extra.length > 0 ? { extra } : {}),
      })
    }

    const allColumns = new Set<string>()
    rows.forEach((row) => {
      row.data.forEach((item) => {
        allColumns.add(item.id)
      })
    })

    return {
      head: [isPromoted.value ? 'Stars' : 'Level', ...Array.from(allColumns)],
      rows,
    }
  }

  const canPromote = computed(() => {
    return equipment.value.rarity === 'imperial' && activeStar.value === 5 && !isPromoted.value
  })

  const promote = () => {
    if (canPromote.value) {
      isPromoted.value = true
    }
  }

  const tableData = computed<TableData>(() => equipmentToTableData(equipment.value))

  const updateEquipment = (newEquipment: Equipment) => {
    equipment.value = newEquipment
    isPromoted.value = false
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
