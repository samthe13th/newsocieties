import { Component, OnInit, HostListener, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { range, chunk, includes, difference } from 'lodash';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

const MAX_HARVEST = 49;
const KEY_CODE = {
  e: 69,
  g: 71
}

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
  
  private landTiles: Array<LandTile> = [];
  private selectedCardCoords: [number, number] | undefined;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const [r, i] = this.selectedCardCoords;
    if(event.keyCode === KEY_CODE.e){
      if (this.selectedCardCoords) {
        console.log("EXPLORE", this.landGrid[r][i]);
        this.explore(r,i);
        this.clearSelection(r, i);
        if (this.landSelectSheet) {
          this.landSelectSheet.dismiss();
        }
      }
      console.log('E: ', event);
    } else if (event.keyCode === KEY_CODE.g) {
      console.log('G: ', event)
    }
  }

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

  newHarvest() {
    this.landGrid = this.generateHarvest(41, 10);
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
      this.landTiles[i].value = -1;
    })

    // Generate harvest (selectable card tiles)
    const harvest = difference(slots, removals);
    console.log('NEW HARVEST: ', harvest, 'SLOTS: ', slots, 'REMOVALS: ', removals)
    
    // Add contaminants
    const contaminents = this.pluck(harvest, totalContaminents);
    contaminents.forEach((i) => {
      this.landTiles[i].value = 0;
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
  }

  clearSelection(r, i) {
    this.landGrid[r][i].mark = null;
    this.selectedCardCoords = null;
  }

  mark(r, i) {
    this.selectedCardCoords = undefined;
    const card = this.landGrid[r][i];
    card.mark = card.mark ? null : 1;
    this.selectedCardCoords = [r,i];
  }

  explore(r, i) {
    const card = this.landGrid[r][i];
    console.log(card)
    if (card.side === 'back' && card.value !== -1) {
      this.landGrid[r][i].side = 'front';
    }
  }

  process(r, i) {
    // A card value of 0 signifies a contaminant
    if (this.landGrid[r][i].value === 0) {
      const left = this.landGrid[r]?.[i - 1];
      const right = this.landGrid[r]?.[i + 1];
      const top = this.landGrid[r - 1]?.[i];
      const bottom = this.landGrid[r + 1]?.[i];

      setTimeout(() => {
        if (left && !left.owner) {
          left.contaminated = true;
        }
        if (right && !right.owner) {
          right.contaminated = true;
        }
        if (top && !top.owner) {
          top.contaminated = true;
        }
        if (bottom && !bottom.owner) {
          bottom.contaminated = true;
        }
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
