import * as fa from '@fortawesome/free-solid-svg-icons';

export const DIVISIONS = ["N", "NE", "W", "NW", "E", "SW", "S", "SE"];

export const FOCUS_BUTTONS = [
    { id: 'harvest', label: 'Harvest', faIcon: fa.faLeaf },
    { id: 'principles', label: 'Principle', faIcon: fa.faLandmark },
    { id: 'resolutions', label: 'Resolution', faIcon: fa.faGavel },
    { id: 'scenario', label: 'Scenario', faIcon: fa.faGlobe },
    { id: 'misc', label: 'Market', faIcon: fa.faCartPlus },
    { id: 'review', label: 'Review', faIcon: fa.faScroll }
]

export const IPAD_FOCUS_BUTTONS = [
    { id: 'principles', label: 'Principle' },
    { id: 'resolutions', label: 'Resolution' },
    { id: 'scenario', label: 'Scenario' }
]
