export const imperialBoots: Equipment = {
  id: 'imperial-boots',
  name: 'Imperial Boots',
  slot: 'boots',
  rarity: 'imperial',
  statsProgression: {
    heroDefense: {
      values: [40, 50, 60, 80, 100, 120, 140, 160, 179],
      extra: {
        10: '100',
        30: '100',
      },
      promote: [1500, 190, 200, 300, 400],
    },
    heroHP: {
      values: [10500, 11500, 12750, 14000, 16500, 18800, 21000, 23200, 28206],
      incrementPerLevel: 100,
      promote: [150, 190, 200, 300, 400],
    },
    boostHeroHP: {
      values: [2.50, 2.75, 3.00, 3.25, 3.50, 3.75],
      promote: [150, 190, 200, 300, 400],
    },
    boostHeroDefense: {
      values: [2.50, 2.75, 3.00, 3.25, 3.50, 3.75],
      promote: [150, 190, 200, 300, 400],
    },
    magicDamageResistance: {
      values: [0],
      extra: {
        20: '10.00%',
        40: '10.00%',
      },
      promote: [150, 190, 200, 300, 400],
    },
  },
}
