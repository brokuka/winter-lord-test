interface LevelStats {
  [stat: string]: number
}

export default function useEquipment(initialEquipment: Equipment) {
  const equipment = ref(initialEquipment)
  const stars = ref(0) // Начальное количество звезд установлено на 0

  function formatName(stat: string): string {
    return stat.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').map(part =>
      part.length > 1 && part === part.toUpperCase()
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    ).join(' ')
  }

  const generateValue = (statProgression: StatProgression, level: number, stars: number, baseValue: number): number => {
    let statValue = baseValue // Используем базовое значение из baseStats для начальной точки

    // Применяем прирост на уровне
    statValue += statProgression.incrementPerLevel * level

    // Применяем прирост за звезды
    statValue += statProgression.incrementPerStar * stars

    // Применяем специальные приросты
    if (statProgression.specialIncrements) {
      for (let star = 1; star <= stars; star++) {
        const specialIncrement = statProgression.specialIncrements[star]
        if (specialIncrement) {
          statValue = specialIncrement
          break // Apply the special increment for the current star level and exit the loop
        }
      }
    }

    return Math.round(statValue * 100) / 100 // Округление до 2 знаков после запятой
  }

  const generateStatsByLevel = (baseStats: EquipmentStats, statsProgression: StatsProgression, maxLevel: number): LevelStats[] => {
    const levelsStats: LevelStats[] = []
    for (let level = 0; level <= maxLevel; level++) {
      const levelStats: LevelStats = {}
      for (const [stat, baseValue] of Object.entries(baseStats)) {
        const progression = statsProgression[stat as StatType] || { base: baseValue, incrementPerLevel: 0, incrementPerStar: 0 } as StatProgression
        levelStats[formatName(stat)] = generateValue(progression, level, stars.value, baseValue)
      }
      levelsStats.push(levelStats)
    }
    return levelsStats
  }

  const equipmentToTableData = (eq: Equipment) => {
    const levelsStats = generateStatsByLevel(eq.baseStats, eq.statsProgression, eq.maxLevel)

    return {
      head: ['Level'].concat(Object.keys(eq.baseStats).map(formatName)),
      rows: levelsStats.map((levelStats, index) => ({
        name: `Level ${index}`,
        data: Object.entries(levelStats).map(([stat, value]) => ({
          id: stat,
          value,
        })),
      })),
    }
  }

  const tableData = computed(() => equipmentToTableData(equipment.value))

  const updateEquipment = (newEquipment: Equipment) => {
    equipment.value = newEquipment
  }

  return {
    tableData,
    updateEquipment,
    stars,
  }
}
