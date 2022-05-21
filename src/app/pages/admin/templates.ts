const COMMON_DEFAULTS = {
  reserveThresholds: {
    low: 5, 
    mid: 10,
    high: 15
  },
  harvest: 21,
  landCost: 4
}

export const SHOW_DEFAULTS = {
  small: {
    ...COMMON_DEFAULTS,
    capacity: 6,
  }, 
  medium: {
    ...COMMON_DEFAULTS,
    capacity: 9,
  },
  large: {
    ...COMMON_DEFAULTS,
    capacity: 12,
  },
  full: {
    ...COMMON_DEFAULTS,
    capacity: 12
  }
}

export const DIVISION_TEMPLATE = {
  events: [],
  harvestColumn: [true, true, true, true, true, true, true],
  lockHarvestColumns: false,
  marketView: 'localLand',
  advancements: {
    safety: {
      communal: 0,
      reward: {
        name: 'SafeExplore',
        text: 'Exploring a contamination will not affect the harvest.'
      }
    },
    health: {
      communal: 0,
      reward: {
        name: 'SafeGather',
        text: 'Gathering a contamination will not affect your hand.'
      }
    },
    arts: {
      communal: 0,
      reward: {
        name: 'None',
        text: 'The effect is immeasurable.'
      }
    },
    knowledge: {
      communal: 0,
      reward: {
        name: 'Peak',
        text: 'Peek at one resource on the harvest without exploring.'
      }
    },
    infrastructure: {
      communal: 0,
      reward: {
        name: 'ExtraAction',
        text: 'Player can use 1 extra action (does not affect Capacity).'
      }
    }
  },
  advancementCosts: [2,4,6],
  highThresholdsMet: 0,
  imports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
  },
  playerViews: {
    banner: true,
    player: true,
    otherPlayers: true,
    resources: false,
    advancements: false,
  },
  nextSeason: {
    season: 1,
    capacity: 12,
    harvest: 28
  },
  exports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
  },
  contaminantLevel: 0,
  VP: 0,
  score: 'Low',
  season: 0,
  reserve: 0,
  actions: 0,
  focus: "none",
}

export const SHOW_TEMPLATE = {
  clock: 0,
  live: false,
  centralAdjustment: 0,
  contamination: {
    min: 10,
    max: 90,
    current: 10,
    start: 0,
    end: 90,
    formula: 'linear'
  },
  content: {}
}