import { Output, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { range, chunk, isEqual, each, filter, toNumber, difference } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, tap, take, isEmpty } from 'rxjs/operators';
import { LandCardValues, LandTile } from 'src/app/interfaces';
import { BankService } from 'src/app/services/bank.service';
import { pluckRandom, getRandomInt } from 'src/app/utilties';

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
  selection;
  landTiles;
  animateTiles;

  landSelectSheet;
  selectedResourceStatus;
  selectedCardIndex;
  positions;
  contamination;
  harvestEvent;

  private _turn;
  private destroy$ = new Subject<boolean>();

  @Output() gatherResource: EventEmitter<{ value: number }> = new EventEmitter();
  @Output() select: EventEmitter<LandTile> = new EventEmitter();

  @Input() markCards: boolean;
  @Input() updatePath;
  @Input() showId;
  @Input() player;
  @Input() divisionKey;
  @Input() 
  get turn() { return this._turn };
  set turn(value) {
    this._turn = value;
  }

  constructor(
    private db: AngularFireDatabase,
    private bankService: BankService,
    private _bottomSheet: MatBottomSheet
  ) {}

  getPosition(id) {
    if (this.positions?.indexOf(id) !== -1) {
      return this.positions?.indexOf(id) + 1
    }
    return '';
  }

  ngOnInit() {
    console.log('selection path: ', `shows/${this.showId}/divisions/${this.divisionKey}/selection`)
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/positions`)
      .valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((positions) => {
      this.positions = positions;
    })
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/harvestEvent`).valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        this.harvestEvent = event;
      })

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
        this.selection = selection;
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
        this.adjustContamination(level);
      })
  }

  afterToastHide() {
    this.harvestEvent = undefined;
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/harvestEvent`).remove()
  }

  private adjustContamination(level) {
    console.log('adjust contam')
    this.contamination = level;
    if (this.landTiles) {
      const cardIndexes = this.landTiles
        .map((tile, index) => tile.value == LandCardValues.EMPTY ? -1 : index)
        .filter(value => value !== -1);
      const contaminantsCount = Math.ceil((this.contamination / 100) * cardIndexes.length)
      const currentContaminantIndexes = this.landTiles
        .map((tile, index) => tile.value === LandCardValues.CONTAM ? index : -1)
        .filter(value => value !== -1);
      const adjustment = contaminantsCount - currentContaminantIndexes.length;

      console.log({cardIndexes, contaminantsCount, current: currentContaminantIndexes.length, adjustment })
      if (adjustment > 0) {
        const contaminate = pluckRandom(
          difference(cardIndexes, currentContaminantIndexes),
          Math.min(adjustment, cardIndexes.length)
        );
        console.log('add contams: ', contaminate)
        contaminate.forEach((i) => {
          if (!this.landTiles[i].harvested) {
            this.landTiles[i].value = LandCardValues.CONTAM;
          }
        })
      } else if (adjustment < 0) {
        const uncontaminate = pluckRandom(currentContaminantIndexes, Math.min(Math.abs(adjustment), currentContaminantIndexes.length));
        console.log('Remove contams: ', uncontaminate)
        uncontaminate.forEach((i) => {
          if (!this.landTiles[i].harvested) {
            this.landTiles[i].value = getRandomInt(1,3);
          }
        })
      }
    }
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

  // gatherOwnedLand() {
  //   this.landTiles.forEach((card, i) => {
  //     if (card.owner) {
  //       card.harvested = false;
  //       this.process(i);
  //     }
  //   })
  // }

  exploreOwnedLand() {
    console.log("harvest owned land")
    this.landTiles.forEach((tile) => {
      if (tile.owner) {
        console.log("FLIP: ", tile);
        this.explore(tile);
      }
    })
  }

  gatherOwnedLand() {
    const toGather = {};
    this.landTiles.forEach((tile) => {
      if (tile.owner && tile.value !== -1) {
        if (!toGather[tile.owner.id]) {
          toGather[tile.owner.id] = [];
        }
        toGather[tile.owner.id].push({
          value: tile.owner.division != this.divisionKey 
            ? 3 : tile.value,
          division: tile.owner.division
        })
        this.landTiles[tile.index].value = -1;
      }
    })
    if (Object.keys(toGather).length !== 0) {
      console.log("to gather: ", toGather)
      this.bulkGatherResources(toGather);
    }
  }

  bulkGatherResources(toGather) {
    let harvestCount = 0;
    each(toGather, async (resources, id) => {
      const { division } = resources[0];
      console.log("bulk deposit... ", id, division)
      harvestCount += resources.length;
      this.bankService.depositResources(
        this.showId,
        division,
        id,
        resources
      ).then(() => {
        console.log('up harvest count: ', resources.length)
        console.log('deposited')
      })
    })

    this.updateHarvestedCount(harvestCount);
    this.updateDB();
  }

  selectTile(card) {
    console.log('select: ', this.player)
    if (this.turn?.id !== this.player?.id) {
      console.log('cannot make move', this.turn, this.turn?.id !== this.player?.id, this.player?.actions < 1, this.player?.id)
      return
    }
    this.select.emit(card);
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

  explore(card, playerId=null) {
    console.log('explore: ', card);
    if (!card.harvested && card.value !== LandCardValues.EMPTY) {
      this.landTiles[card.index].harvested = true;
      this.updateDB();
    }
    this.clearSelection(card.index);
    if (playerId) {
      this.takeAction(playerId);
    }
  }

  takeAction(playerId) {
    console.log('take action... ', playerId)
    this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/citizens/${playerId}/actions`)
      .query.ref.transaction(actions => actions ? --actions : 0
    );
  }

  gather(card, playerId) {
    console.log('do gather')
    this.gatherResource.emit(card);
    this.landTiles[card.index].value = -1;
    this.updateHarvestedCount(1);
    this.updateDB();
    this.clearSelection(card.index);
    if (playerId) {
      this.takeAction(playerId);
    }
  }

  async updateHarvestedCount(n) {
    const path = `shows/${this.showId}/divisions/${this.divisionKey}/harvested`;
    console.log('update harvested count: ', path, n)
    this.db.object(path).query.ref.transaction(harvested => harvested ? ++n : n)
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
      const placements = ['left', 'right', 'top', 'bottom'];
      const tiles = placements.map((placement) => this.landTiles[this.getRelativeGridIndex(i, placement, 1)])
      const destroyed = [];

      setTimeout(() => {
        tiles.forEach((tile, index) => {
          if (tile && !tile.owner && !tile.contaminated) {
            destroyed.push(tile.value)
            tiles[index].contaminated = true;
          }
        })

        this.db.object(`shows/${this.showId}/divisions/${this.divisionKey}/harvestEvent`).set({
          tile: tile.index,
          type: 'exposeContaminant',
          message: `A contaminant has been exposed!`,
          value: filter(destroyed, (value) => value > 0),
          duration: 2500
        })

        this.updateDB();
      })
    }
  }
}
