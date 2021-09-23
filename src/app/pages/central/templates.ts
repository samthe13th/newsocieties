export const DIVISION_TEMPLATE = {
  achievements: {
    safety: {
     accomplishedBy: null,
     reward: 'Exploring a contamination will not affect the harvest line.'
    },
    health: {
      accomplishedBy: null,
      reward: 'Gathering a contamination will not affect your hand.'
    },
    arts: {
      accomplishedBy: null,
      reward: 'The effect is immeasurable.'
    },
    knowledge: {
      accomplishedBy: null,
      reward: 'Peek at one resource on the harvest line without exploring.'
    },
    infastructure: {
      accomplishedBy: null,
      reward: '+1 action.'
    }
  },
  imports: {
    messages: [],
    gla: [],
    resources: [],
    players: []
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
  principles: [],
  resolutions: [],
  season: 1,
  messages: [],
  incomingAnnouncement: null,
  announcements: [],
  reserve: [1, 2, 3, 2],
  reserveThresholds: {
    low: 7, 
    mid: 12,
    hight: 17
  },
  capacity: 18,
  extra: 8,
  harvest: 25,
  harvested: 20,
  land: [],
  citizens: []
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
  newsFeed: [],
  content: {},
  global: {
    actual: 63,
    capacity: 50
  }
}