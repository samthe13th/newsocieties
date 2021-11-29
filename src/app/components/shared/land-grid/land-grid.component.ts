import { Output, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { range, chunk, isEqual, each, difference } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LandCardValues, LandTile, LandCardTypes } from 'src/app/interfaces';
import { BankService } from 'src/app/services/bank.service';
import { pluckRandom, getRandomInt } from 'src/app/utilties';
import { Howl, Howler } from 'howler';

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
  harvestColumns;
  Sounds;

  private _turn;
  private _player;
  private destroy$ = new Subject<boolean>();

  @Output() gatherResource: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<LandTile> = new EventEmitter();

  @Input() markCards: boolean;
  @Input() updatePath;
  @Input() showKey;
  @Input() showHarvest = true;
  @Input()
  get player() { return this._player }
  set player(value) {
    this._player = value
  }

  @Input() isHost = false;
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
    this.Sounds = {
      contamination: new Howl({ src: 'assets/Contamination.mp3' }),
      resource1: new Howl({ src: 'assets/gather1.mp3' }),
      resource2: new Howl({ src: 'assets/gather2.mp3' }),
      resource3: new Howl({ src: 'assets/gather3.mp3' }),
    }
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/positions`)
      .valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((positions) => {
      this.positions = positions;
    })

    combineLatest(
      this.db.object(this.updatePath).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/selection`).valueChanges()
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([tiles, selection]: [any[], any]) => {
        this.selection = selection;
        if (!this.landTiles) {
          this.landTiles = tiles;
        }
        tiles.forEach((update, i) => {
          if (!isEqual(update, this.landTiles[i])) {
            const tile = this.landTiles[i];
            tile.type = update.type;
            tile.harvested = update.harvested;
            tile.value = update.value;
            tile.contaminated = update.contaminated;
            tile.owner = update.owner ?? null;
          }
        })
      })

    if (this.isHost) {
      combineLatest(
        this.db.object(`shows/${this.showKey}/contamination/current`).valueChanges(),
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/contaminantLevel`).valueChanges()
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(([percent, level]) => {
        console.log({percent, level})
        this.adjustContamination(percent, level);
        this.updateDB();
      })
    }

    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/harvestColumn`)
      .valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((columns: any) => {
        columns.forEach((showColumn: boolean, i: string) => {
          if (this.harvestColumns?.[i] !== showColumn) {
            this.toggleColumn(i, showColumn)
          }
        })
        this.harvestColumns = columns;
      })
  }

  private adjustContamination(percent, level) {
    console.log("adjust contams: ", level)
    this.contamination = percent;
    if (this.landTiles) {
      const harvestable = this.landTiles
        .filter(card => card.value !== LandCardValues.EMPTY && !card.contaminated)
      const contaminantsCount = Math.ceil((this.contamination / 100) * harvestable.length)
      const currentContaminantIndexes = harvestable
        .filter(card => card.type === LandCardTypes.C)
        .map(card => card.index)
      const adjustment = contaminantsCount - currentContaminantIndexes.length;

      if (adjustment > 0) {
        const contaminate = pluckRandom(
          difference(harvestable.map(h => h.index), currentContaminantIndexes),
          Math.min(adjustment, harvestable.length)
        );
        contaminate.forEach((i) => {
          if (!this.landTiles[i].harvested) {
            const random = getRandomInt(1, 10);
            let contamValue = 1;
            if (random > 5 && level > 1) {
              contamValue = 2;
            }
            if (random > 8 && level > 2) {
              contamValue = 3
            }
            console.log({level, contamValue, random})
            this.landTiles[i].type =  LandCardTypes.C;
            this.landTiles[i].value = contamValue;
          }
        })
      } else if (adjustment < 0) {
        const uncontaminate = pluckRandom(
          currentContaminantIndexes,
          Math.min(Math.abs(adjustment), currentContaminantIndexes.length));
        uncontaminate.forEach((i) => {
          if (!this.landTiles[i].harvested) {
            this.landTiles[i].type = LandCardTypes.R;
            this.landTiles[i].value = getRandomInt(1, 3);
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

  gatherGLA() {
    const toGather = {};
    this.landTiles.forEach((tile) => {
      if (tile.owner && tile.owner?.division !== this.divisionKey && tile.value !== -1) {
        if (!toGather[tile.owner.id]) {
          toGather[tile.owner.id] = [];
        }
        toGather[tile.owner.id].push({
          value: tile.owner.division != this.divisionKey ? 3 : tile.value,
          division: tile.owner.division
        })
        this.landTiles[tile.index].value = -1;
      }
    })
    if (Object.keys(toGather).length !== 0) {
      this.bulkGatherResources(toGather);
    }
  }

  bulkGatherResources(toGather) {
    let actionsCount = 0;
    each(toGather, async (resources, id) => {
      const { division } = resources[0];
      actionsCount += resources.length;
      this.bankService.depositResources(
        this.showKey,
        division,
        id,
        resources.map(r => ({ ...r, division: this.divisionKey }))
      )
    })

    this.updateDB();
  }

  selectTile(card) {
    console.log('play sound')
    if (this.turn !== this.player?.id) {
      console.log('cannot make move', this.turn, this.turn !== this.player?.id, this.player?.actions < 1, this.player?.id)
      return
    }
    this.select.emit(card);
  }

  clearSelection(index) {
    this.selectedCardIndex = null;
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/selection`).remove();
  }

  async exploreOwnedLand() {
    this.landTiles.forEach(async (tile) => {
      if (tile.owner) {
        if (!tile.harvested && tile.value !== LandCardValues.EMPTY) {
          this.landTiles[tile.index].harvested = true;
          await this.process(tile.index);
        }
      }
    })
    this.updateDB();
  }

  async explore(card, playerId = null, safe = false) {
    if (!card.harvested && card.value !== LandCardValues.EMPTY) {
      this.landTiles[card.index].harvested = true;
      await this.process(card.index, safe);
      if (playerId) {
        this.takeAction(playerId);
      }
    }
    this.clearSelection(card.index);
    this.updateDB();
  }

  playGatherSound(type, value) {
    if (type === LandCardTypes.C) {
      this.Sounds.contamination.play();
    } else if (value === 1) {
      this.Sounds.resource1.play();
    } else if (value === 2) {
      this.Sounds.resource2.play();
    } else if (value === 3) {
      this.Sounds.resource3.play();
    }
  }

  takeAction(playerId) {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/actions`)
      .query.ref.transaction(actions => actions ? ++actions : 1);
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens/${playerId}/actions`)
      .query.ref.transaction(actions => actions ? ++actions : 1);
  }

  gather(card, playerId, safe=false) {
    if (playerId===null) return;
    this.playGatherSound(card.type, card.value)
    this.gatherResource.emit({ tile: card, playerId, safe });
    this.landTiles[card.index].value = -1;
    this.clearSelection(card.index);
    if (playerId) {
      this.takeAction(playerId);
    }
    this.updateDB();
  }

  updateDB() {
    console.log('update db')
    this.db.object(this.updatePath).set(this.landTiles);
  }

  getRelativeGridIndex(index, dir, dist) {
    const grid = chunk(range(MAX_HARVEST), HARVEST_ROW_LENGTH);
    const r = Math.floor(index / HARVEST_ROW_LENGTH);
    const c = index % HARVEST_ROW_LENGTH;
    
    if (dir === 'left') { return grid[r]?.[c - dist] }
    if (dir === 'right') { return grid[r]?.[c + dist] }
    if (dir === 'top') { return grid[r - dist]?.[c] }
    if (dir === 'bottom') { return grid[r + dist]?.[c] }
    if (dir === 'topleft') { return grid[r - dist]?.[c - dist] }
    if (dir === 'topright') { return grid[r - dist]?.[c + dist] }
    if (dir === 'bottomleft') { return grid[r + dist]?.[c - dist] }
    if (dir === 'bottomright') { return grid[r + dist]?.[c + dist] }
  }

  async process(i, safe=false) {
    const tile = this.landTiles[i];
    console.log('process: ', tile);
    if (!safe && tile.type === LandCardTypes.C && tile.harvested && !tile.owner) {
      await this.contaminateAdjacentTiles(tile);
    }
    this.updateDB();
  }

  toggleColumn(n, enable) {
    if (!this.landTiles) return;
    range(7).forEach((i) => {
      const index = n + (i * 7);
      this.landTiles[index].disabled = !enable;
    })
    this.updateDB();
  }

  async contaminateAdjacentTiles(tile) {
    console.log('contam adj: ', tile)
    let placements;
    if (tile.value === 1) {
      placements = ['left', 'right'];
    } else if (tile.value === 2) {
      placements = ['left', 'right', 'top', 'bottom'];
    } else if (tile.value === 3) {
      placements = ['left', 'right', 'top', 'bottom', 'topleft', 'topright', 'bottomleft', 'bottomright'];
    }
    const tiles = placements.map(
      (placement) => this.landTiles[this.getRelativeGridIndex(tile.index, placement, 1)]
    )
    
    return new Promise((resolve) => {
      setTimeout(() => {
        tiles.forEach((tile, index) => {
          if (tile && !tile.owner && !tile.contaminated) {
            this.landTiles[tile.index].contaminated = true;
            console.log('contaminate tile: ', this.landTiles[index])
          }
        })
        resolve();
      })
    })
  }
}
