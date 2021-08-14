import { Output, Component, OnInit, HostListener, Input, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { range, chunk, includes, difference } from 'lodash';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { faEye, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const MAX_HARVEST = 49;
const KEY_CODE = {
  e: 69,
  g: 71
}

export enum LandCardValues {
  EMPTY = -1,
  CONTAM = 0,
  V1 = 1,
  V2 = 2,
  V3 = 3
}
export type LandCardValue = LandCardValues | keyof typeof LandCardValues;

export interface LandOwner {
  name: string;
  division: string;
}

export interface LandTile {
  value: number;
  owner: LandOwner, 
  side: 'back' | 'front';
  contaminated: boolean;
  mark: string | number | null;
}

export type LandGrid = Array<LandTile[]>;

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss'],
  host: {
    '[class.harvest]': 'true'
  }
})
export class HarvestComponent implements OnInit {
  landGrid: LandGrid = [];
  landSelectSheet;
  selectedResourceStatus;

  // ICONS
  exploreIcon = faEye;
  gatherIcon = faShoppingBag;
  
  private destroy$ = new Subject<boolean>();
  private landTiles: Array<LandTile> = [];
  private selectedCardCoords: [number, number] | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const [r, i] = this.selectedCardCoords;
    if(event.keyCode === KEY_CODE.e){
      this.explore();
    } else if (event.keyCode === KEY_CODE.g) {
      this.gather(); 
    }
  }

  @Output() gatherResource: EventEmitter<{ value: number }> = new EventEmitter();

  @Input() player: string;

  @Input() division: string;

  constructor(
    firestore: AngularFirestore, 
    private _bottomSheet: MatBottomSheet
    ) {
    this.landGrid = shuffle(this.landGrid);
  }

  ngOnInit() {
    const slots = range(MAX_HARVEST);
    this.landTiles = slots.map(() => ({ 
      value: getRandomInt(1, 3), 
      owner: this.getOwner(), 
      side: 'back', 
      contaminated: false,
      mark: null
     }))
     this.newHarvest();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getResourceStatus() {
    const card = this.getSelectedCard();
    if (!card) {
      return
    }
    if (card.side === 'back') {
      return {
        status: 'explorable'
      }
    } else if (card.value == 0) {
      return {
        status: 'contaminated',
        message: 'This land is contaminated'
      }
    } else if (card.owner) {
      const ownedBy = card.owner.division == card.owner.name
        ? 'a member of the ' + card.owner.division + ' division'
        : 'player ' + card.owner.name
      return {
        status: 'owned',
        message: 'This land is owned by ' + ownedBy
      }
    }
    return {
      status: 'explored',
    }
  }

  getSelectedCard() {
    if (this.selectedCardCoords) {
      const [r, i] = this.selectedCardCoords;
      return this.landGrid[r][i];
    }
    return null;
  }

  newHarvest() {
    this.landGrid = this.generateHarvest(13, 2);
    setTimeout(() => {
      this.gatherOwnedLand();
    }, 500)
  }

  getOwner() {
    const owned = getRandomInt(0,3) == 0;
    const div = getRandomInt(0,1) == 0 ? 'NE' : 'W';

    return owned ? {
      name: div,
      division: div
    } : null
  }

  resetLandTiles() {
    this.landTiles = <LandTile[]>[ 
      ...this.landTiles.map((tile: LandTile) => ({
        ...tile,
        side: 'back',
        value: getRandomInt(1, 3), 
        contaminated: false,
        mark: null
    }))]
  }

  generateHarvest(totalCards, totalContaminents): LandGrid {
    // Start with a range of integers
    const slots = range(MAX_HARVEST);
    this.resetLandTiles();

    // Generate indexes for removing tiles
    const removals = this.pluck(slots, MAX_HARVEST - totalCards)
    removals.forEach((i) => {
      this.landTiles[i].value = LandCardValues.EMPTY;
    })

    // Generate harvest (selectable card tiles)
    const harvest = difference(slots, removals);

    // Add contaminants
    const contaminents = this.pluck(harvest, totalContaminents);
    contaminents.forEach((i) => {
      this.landTiles[i].value = LandCardValues.CONTAM;
    })

    // Build matrix (2D array)
    return chunk(this.landTiles, 7);
  }

  gatherOwnedLand() {
    this.landGrid.forEach(((row, r) => {
      row.forEach((card, i) => {
        if (card.owner) {
          card.side = 'front';
          this.process(r, i);
        }
      })
    }))
  }

  pluck(array, remove) {
    const toRemove = [];
    while(toRemove.length < remove) {
      const value = array[getRandomInt(0, array.length - 1)];
      if (!includes(toRemove, value)) {
        toRemove.push(value)
      }
    }
    return toRemove;
  }

  selectTile(r, i, sheetTemplate) {
    this.mark(r, i);
    this.landSelectSheet = this._bottomSheet.open(sheetTemplate);
    this.selectedResourceStatus = this.getResourceStatus();
    this.landSelectSheet.afterDismissed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.selectedCardCoords) {
        this.clearSelection();
      }
    })
  }

  clearSelection() {
    const [r, i] = this.selectedCardCoords;
    this.landGrid[r][i].mark = null;
    this.selectedCardCoords = null;
  }

  mark(r, i) {
    if (this.selectedCardCoords) {
      this.clearSelection();
    }
    const card = this.landGrid[r][i];
    card.mark = card.mark ? null : 1;
    this.selectedCardCoords = [r,i];
  }

  explore() {
    if (this.selectedCardCoords) {
      const [r, i] = this.selectedCardCoords;
      const card = this.landGrid[r][i];
      if (card.side === 'back' && card.value !== -1) {
        this.landGrid[r][i].side = 'front';
      }
      if (this.landSelectSheet) {
        this.landSelectSheet.dismiss();
      }
      this.clearSelection();
    }
  }

  gather() {
    if (this.selectedCardCoords && this.selectedResourceStatus) {
      const status = this.selectedResourceStatus.status;
      if (status === 'explorable' || status === 'explored') {
        console.log('do gather')
        const [r, i] = this.selectedCardCoords;
        const card = this.landGrid[r][i];
        this.gatherResource.emit({ value: card.value });
        this.landGrid[r][i].value = -1;
      }
      if (this.landSelectSheet) {
        this.landSelectSheet.dismiss();
      }
      this.clearSelection();
    }
  }

  process(r, i) {
    // A card value of 0 signifies a contaminant
    if (this.landGrid[r][i].value === LandCardValues.CONTAM) {
      const left = this.landGrid[r]?.[i - 1];
      const right = this.landGrid[r]?.[i + 1];
      const top = this.landGrid[r - 1]?.[i];
      const bottom = this.landGrid[r + 1]?.[i];

      setTimeout(() => {
        if (left && !left.owner) { left.contaminated = true }
        if (right && !right.owner) { right.contaminated = true }
        if (top && !top.owner) { top.contaminated = true }
        if (bottom && !bottom.owner) { bottom.contaminated = true }
      })
    }
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
