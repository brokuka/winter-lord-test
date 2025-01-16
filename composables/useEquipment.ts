export default function useEquipment(initialEquipment: Equipment) {
  const equipment = ref(initialEquipment)
  const activeStar = ref(0)
  const isPromoted = ref(false)
  const maxStars = 5
  const maxLevel = 40

  const starsStats: StarsStats = {
    boots: {
      0: {
        heroDefense: 40,
        heroHP: 10500,
        boostHeroHP: 2.50,
        boostHeroDefense: 2.50,
      },
      1: {
        heroDefense: 50,
        heroHP: 11500,
      },
    },
    sword: {
      0: {
        heroAttack: 10500,
        heroDefense: 40,
        criticalHitRate: 5.00,
        boostHeroAttack: 2.50,
      },
    },
  }

  const levelRequirements: LevelRequirements = {
    0: {
      resourses: [
        { type: 'upgradeOre', amount: 1500 },
      ],
      goldCost: 225000,
    },
    5: {
      resourses: [
        { type: 'upgradeOre', amount: 2200 },
      ],
      goldCost: 337500,
    },
  }

  const formatName = (stat: string): string => {
    return stat.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').map(part =>
      part.length > 1 && part === part.toUpperCase()
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    ).join(' ')
  }

  const generateValue = (statProgression: StatProgression, currentLevel: number): number => {
    if (isPromoted.value) {
      // Для promoted состояния используем значения из promote массива
      // currentLevel здесь представляет количество звёзд (1-5)
      return statProgression.promote[currentLevel]
    }

    // Для обычного состояния используем values и учитываем incrementPerLevel если есть
    let value = statProgression.values[activeStar.value] ?? statProgression.values[0]

    if (statProgression.incrementPerLevel && currentLevel > 0) {
      value += statProgression.incrementPerLevel * currentLevel
    }

    return Math.round(value * 100) / 100
  }

  const generateStatsByLevel = (
    starsStats: StarsStats,
    statsProgression: StatsProgression,
    slot: string,
  ): LevelStats[] => {
    const levelsStats: LevelStats[] = []
    const iterations = isPromoted.value ? maxStars : maxLevel

    for (let i = 0; i <= iterations; i++) {
      const stats: LevelStats = {}
      const currentStarStats = starsStats[slot][isPromoted.value ? 0 : activeStar.value] || {}
      let mergedStarStats: EquipmentStats = { ...currentStarStats }

      if (!isPromoted.value) {
        for (let starLevel = activeStar.value - 1; starLevel >= 0; starLevel--) {
          if (starsStats[slot][starLevel]) {
            mergedStarStats = { ...mergedStarStats, ...starsStats[slot][starLevel] }
          }
        }
      }

      for (const stat of Object.keys(statsProgression) as StatType[]) {
        const progression = statsProgression[stat]
        if (progression) {
          stats[formatName(stat)] = generateValue(progression, i)
        }
      }

      levelsStats.push(stats)
    }
    return levelsStats
  }

  const getLevelRequirements = (levelRequirements: LevelRequirements, level: number): { resourses: Resource[], goldCost: number } => {
    let previousResources: Resource[] = []
    let previousGoldCost = 0

    for (let i = level; i >= 0; i--) {
      if (levelRequirements[i]) {
        previousResources = levelRequirements[i].resourses
        previousGoldCost = levelRequirements[i].goldCost
        break
      }
    }

    return { resourses: previousResources, goldCost: previousGoldCost }
  }

  const addLevelRequirements = (level: number): { id: string, value: number | string }[] => {
    if (isPromoted.value)
      return []

    const data: { id: string, value: number | string }[] = []
    const requirements = getLevelRequirements(levelRequirements, level)

    data.push({
      id: 'Gold',
      value: requirements.goldCost,
    })

    requirements.resourses.forEach((resource) => {
      data.push({
        id: formatName(resource.type),
        value: resource.amount,
      })
    })
    return data
  }

  const getExtraAttributes = (statsProgression: StatsProgression, level: number): { id: string, value: string }[] => {
    const extra: { id: string, value: string }[] = []

    Object.entries(statsProgression).forEach(([stat, progression]) => {
      let starLevel = level
      if (isPromoted.value) {
        // Преобразуем уровень звезды в соответствующий ключ (например, 1 звезда -> 10, 2 звезды -> 20 и т.д.)
        starLevel = (level + 1) * 10
      }

      if (progression.extra?.[starLevel] !== undefined) {
        const value = progression.extra[starLevel]
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

  const equipmentToTableData = (eq: Equipment): TableData => {
    const levelsStats = generateStatsByLevel(starsStats, eq.statsProgression, eq.slot)
    const rows: TableRow[] = []
    const iterations = isPromoted.value ? maxStars - 1 : maxLevel

    for (let i = 0; i <= iterations; i++) {
      const rowData = levelsStats[i]
      const data: { id: string, value: number | string }[] = []
      const extra = getExtraAttributes(eq.statsProgression, i)

      Object.entries(rowData).forEach(([stat, value]) => {
        data.push({
          id: stat,
          value,
        })
      })

      if (!isPromoted.value) {
        data.push(...addLevelRequirements(i))
      }

      rows.push({
        name: isPromoted.value ? `${i + 1}` : `Level ${i}`,
        data,
        ...(extra.length > 0 ? { extra } : {}),
      })
    }

    const firstColumnHeader = isPromoted.value ? 'Stars' : 'Level'
    const headers = [firstColumnHeader].concat(
      Array.from(new Set(rows[0]?.data.map(item => item.id) ?? [])),
    )

    return {
      head: headers,
      rows,
    }
  }

  const canPromote = computed(() => {
    return equipment.value.rarity === 'epic'
      && activeStar.value === 5
      && !isPromoted.value
  })

  const promote = () => {
    if (canPromote.value) {
      isPromoted.value = true
    }
  }

  const tableData = computed(() => equipmentToTableData(equipment.value))

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
