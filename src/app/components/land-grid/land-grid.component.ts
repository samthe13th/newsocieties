import { Output, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { range, chunk, isEqual, isEmpty } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject } from 'rxjs';
import { LandCardValues, LandTile } from 'src/app/interfaces';

const MAX_HARVEST = 49;
const HARVEST_ROW_LENGTH = 7;

@Component({
  selector: 'app-land-grid',
  templateUrl: './land-grid.component.html',
  styleUrls: ['./land-grid.component.scss'],
  host: {
    '[class.grid-wrapper]': 'true'
  }
})
export class LandGridComponent implements OnInit {
  landTiles;
  animateTiles;

  landSelectSheet;
  selectedResourceStatus;
  selectedCardIndex;
  
  private destroy$ = new Subject<boolean>();

  @Output() gatherResource: EventEmitter<{ value: number }> = new EventEmitter();
  @Output() select: EventEmitter<LandTile> = new EventEmitter();

  @Input() markCards: boolean;
  @Input() updatePath;
  @Input() showId;
  @Input() playerId = 0;

  constructor(
    private db: AngularFireDatabase,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.db.object(this.updatePath)
      .valueChanges()
      .subscribe((tiles: any[]) => {
        if (!this.landTiles) {
          this.landTiles = tiles;
        }
        tiles.forEach((update, i) => {
          if (!isEqual(update, this.landTiles[i])) {
            console.log('update: ', update)
            const tile = this.landTiles[i];
            tile.harvested = update.harvested;
            tile.value = update.value;
            tile.contaminated = update.contaminated;
            tile.mark = update.mark ?? null;
            tile.owner = update.owner ?? null;
          }
        })
      })

    this.db.object(`shows/${this.showId}/contamination/current`)
      .valueChanges()
      .subscribe((level) => {
        console.log('adjust contam: ', level)
        //this.adjustContamination(level);
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  cardUpdates(tiles) {
    tiles.forEach((tile, i) => {
      if (isEqual(tile, this.landTiles[i])) {
        this.landTiles[i] = { ...tile };
      }
    })
  }

  getSelectedCard() {
    return this.landTiles?.[this.selectedCardIndex] ?? null;
  }

  gatherOwnedLand() {
    this.landTiles.forEach((card, i) => {
      if (card.owner) {
        card.harvested = false;
        this.process(i);
      }
    })
  }

  selectTile(card) {
    console.log('select: ', card, isEmpty(card.mark))
    if (!card.mark || card.mark === this.playerId) {
      this.select.emit(card);
      this.mark(card);
    }
  }

  clearSelection(index) {
    this.landTiles[index].mark = null;
    this.selectedCardIndex = null;
    this.updateDB();
  }

  mark(_card) {
    if (this.selectedCardIndex) {
      this.clearSelection(this.selectedCardIndex);
    }
    const card = this.landTiles[_card.index];
    card.mark = card.mark ? null : this.playerId;
    this.selectedCardIndex = card.index;
    this.updateDB();
  }

  explore(card) {
    console.log('explore: ', card);
    if (!card.harvested && card.value !== LandCardValues.EMPTY) {
      this.landTiles[card.index].harvested = true;
      console.log('updates: ', this.landTiles);
      this.updateDB();
    }
    this.clearSelection(card.index);
  }

  gather(card) {
    console.log('do gather')
    this.gatherResource.emit({ value: card.value });
    this.landTiles[card.index].value = -1;
    this.updateDB();
    this.clearSelection(card.index);
  }

  updateDB() {
    this.db.object(this.updatePath).update(this.landTiles);
  }

  getRelativeGridIndex(index, dir, dist) {
    const grid = chunk(range(MAX_HARVEST), HARVEST_ROW_LENGTH);
    const r = Math.floor(index / HARVEST_ROW_LENGTH);
    const c = index % HARVEST_ROW_LENGTH;
    
    if (dir === 'left') { return grid[r]?.[c - dist] }
    if (dir === 'right') { return grid[r]?.[c + dist] }
    if (dir === 'top') { return grid[r - dist]?.[c] }
    if (dir === 'bottom') { return grid[r + dist]?.[c] }
  }

  process(i) {
    const tile = this.landTiles[i];
    if (tile.value === LandCardValues.CONTAM && tile.harvested) {
      const left = this.landTiles[this.getRelativeGridIndex(i, 'left', 1)];
      const right = this.landTiles[this.getRelativeGridIndex(i, 'right', 1)];
      const top = this.landTiles[this.getRelativeGridIndex(i, 'top', 1)];
      const bottom = this.landTiles[this.getRelativeGridIndex(i, 'bottom', 1)];

      setTimeout(() => {
        if (left && !left.owner) { left.contaminated = true }
        if (right && !right.owner) { right.contaminated = true }
        if (top && !top.owner) { top.contaminated = true }
        if (bottom && !bottom.owner) { bottom.contaminated = true }
        this.updateDB();
      })
    }
  }
}
