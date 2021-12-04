export const DIVISION_TEMPLATE = {
  events: [],
  harvestColumn: [true, true, true, true, true, true, true],
  lockHarvestColumns: false,
  marketView: 'localLand',
  advancements: {
    safety: {
      communal: 0,
      individual: 0,
      reward: {
        name: 'SafeExplore',
        text: 'Exploring a contamination will not affect the harvest line.'
      }
    },
    health: {
      communal: 0,
      individual: 0,
      reward: {
        name: 'SafeGather',
        text: 'Gathering a contamination will not affect your hand.'
      }
    },
    arts: {
      individual: 0,
      communal: 0,
      reward: {
        name: 'None',
        text: 'The effect is immeasurable.'
      }
    },
    knowledge: {
      individual: 0,
      communal: 0,
      reward: {
        name: 'Peak',
        text: 'Peek at one resource on the harvest line without exploring.'
      }
    },
    infrastructure: {
      individual: 0,
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
    harvest: 25
  },
  exports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
  },
  contaminantLevel: 0,
  landCost: 5,
  VP: 0,
  score: 'low',
  season: 0,
  reserve: 0,
  reserveThresholds: {
    low: 7, 
    mid: 12,
    high: 17
  },
  actions: 0,
  focus: "none",
  capacity: 12,
  harvest: 18,
}

export const SHOW_TEMPLATE = {
  clock: 0,
  live: false,
  contamination: {
    min: 10,
    max: 90,
    current: 10,
    start: 0,
    end: 90,
    formula: 'linear'
  },
  content: {},
  global: {
    actual: 0,
    capacity: 0
  }
}