export const DIVISION_TEMPLATE = {
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
    infastructure: {
      individual: 0,
      communal: 0,
      reward: {
        name: 'ExtraAction',
        text: '+1 action.'
      }
    }
  },
  highThresholdsMet: 0,
  imports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
  },
  nextSeason: {
    season: 1,
    capacity: 18,
    extra: 8,
    harvest: 25
  },
  exports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
  },
  landCost: 5,
  VP: 0,
  score: 'Low',
  season: 0,
  reserve: 0,
  reserveThresholds: {
    low: 7, 
    mid: 12,
    high: 17
  },
  harvested: 0,
  focus: "none",
  turn: {
    index: 1,
    actions: 2
  }
}

export const SHOW_TEMPLATE = {
  clock: 0,
  live: false,
  contamination: {
    min: 5,
    max: 100,
    current: 5,
    formula: 'linear'
  },
  content: {},
  global: {
    actual: 63,
    capacity: 50
  }
}