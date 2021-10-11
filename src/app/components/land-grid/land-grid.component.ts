import { Output, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { range, chunk, isEqual, isEmpty, toNumber } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { takeUntil, tap, take } from 'rxjs/operators';
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
  selectionIndex: number;
  landTiles;
  animateTiles;

  landSelectSheet;
  selectedResourceStatus;
  selectedCardIndex;

  private actions;
  private _turn;
  private destroy$ = new Subject<boolean>();

  @Output() gatherResource: EventEmitter<{ value: number }> = new EventEmitter();
  @Output() select: EventEmitter<LandTile> = new EventEmitter();

  @Input() markCards: boolean;
  @Input() updatePath;
  @Input() showId;
  @Input() playerId;
  @Input() divisionKey;
  @Input() 
  get turn() { return this._turn };
  set turn(value) {
    this._turn = value;
    this.actions = (this._turn?.playerId === this.playerId)
      ? this._turn?.actions
      : 0
  }

  constructor(
    private db: AngularFireDatabase,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    console.log('selection path: ', `shows/${this.showId}/divisions/${this.divisionKey}/selection`)
    combineLatest(
      this.db.object(this.updatePath)
        .valueChanges()
        .pipe(takeUntil(this.destroy$)
      ),
      this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/selection`)
        .valueChanges()
        .pipe(
          tap((x) => console.log({x})),
          takeUntil(this.destroy$)
      )
    ).subscribe(([tiles, selection]: [any[], any]) => {
      console.log('update: ', selection)
        this.selectionIndex = selection?.type === 'harvest-tile' ? toNumber(selection.value) : null;
        if (!this.landTiles) {
          this.landTiles = tiles;
        }
        tiles.forEach((update, i) => {
          if (!isEqual(update, this.landTiles[i])) {
            const tile = this.landTiles[i];
            tile.harvested = update.harvested;
            tile.value = update.value;
            tile.contaminated = update.contaminated;
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
    this.destroy$.unsubscribe();
  }

  tileSelected(index) {
    console.log("selected? : ", index, this.selectedCardIndex, typeof index, typeof this.selectedCardIndex);
    return index === this.selectedCardIndex
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
    if (this.turn?.playerId !== this.playerId || this.turn?.actions < 1) {
      console.log('cannot make move', this.turn, this.turn?.playerId !== this.playerId, this.turn?.actions < 1, this.playerId)
      return
    }
    this.select.emit(card);
    console.log('select: ', card, isEmpty(card.mark))
  }

  clearSelection(index) {
    this.selectedCardIndex = null;
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/selection`).remove();
    this.updateDB();
  }

  // mark(_card) {
  //   if (this.selectedCardIndex) {
  //     this.clearSelection(this.selectedCardIndex);
  //   }
  //   const card = this.landTiles[_card.index];
  //   card.mark = card.mark ? null : this.playerId;
  //   this.selectedCardIndex = card.index;
  //   this.updateDB();
  // }

  explore(card) {
    console.log('explore: ', card);
    if (!card.harvested && card.value !== LandCardValues.EMPTY) {
      this.landTiles[card.index].harvested = true;
      this.updateDB();
    }
    this.clearSelection(card.index);
    this.takeAction();
  }

  takeAction() {
    this.actions--;
    console.log('action: ', this.turn, this.actions)
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/citizens/${this.turn?.playerPosition - 1}`)
      .update({ actions: this.actions })
  }

  gather(card) {
    console.log('do gather')
    this.gatherResource.emit({ value: card.value });
    this.landTiles[card.index].value = -1;
    this.updateHarvestedCount();
    this.updateDB();
    this.clearSelection(card.index);
    this.takeAction();
  }

  async updateHarvestedCount() {
    const path = `shows/${this.showId}/divisions/${this.divisionKey}/harvested`;
    const harvested = await this.db.object(path).valueChanges()
      .pipe(take(1))
      .toPromise()

    console.log({harvested})

    this.db.object(path).set(toNumber(harvested) + 1)
  }

  updateDB() {
    console.log('update db: ', this.landTiles)
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
