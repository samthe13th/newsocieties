import { Output, Component, OnInit, Input, EventEmitter } from '@angular/core';
import { range, chunk, isEqual, each, difference } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { takeUntil, tap, throttleTime } from 'rxjs/operators';
import { LandCardValues, LandTile, LandCardTypes } from 'src/app/interfaces';
import { BankService } from 'src/app/services/bank.service';
import { pluckRandom, getRandomInt } from 'src/app/utilties';
import { Howl } from 'howler';
import { DivisionService } from 'src/app/services/division-service.service';

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
  landmarks;

  Sounds;

  private _turn;
  private _player;
  private destroy$ = new Subject<boolean>();

  @Output() gatherResource: EventEmitter<any> = new EventEmitter();
  @Output() exploreResource: EventEmitter<any> = new EventEmitter();
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

  SoundCue: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private db: AngularFireDatabase,
    private bankService: BankService,
    private divisionService: DivisionService,
    private _bottomSheet: MatBottomSheet,
  ) {}

  getPosition(id) {
    if (this.positions?.indexOf(id) !== -1) {
      return this.positions?.indexOf(id) + 1
    }
    return '';
  }

  onCardFlip(card) {
    if (!this.isHost) {
      this.SoundCue.next(card)
    }
  }

  ngOnInit() {
    this.SoundCue.pipe(
      takeUntil(this.destroy$),
      throttleTime(1000)
    ).subscribe((cue) => {
      if (cue?.type === 'R') {
        this.playExploreSound(cue.value)
      } else if (cue?.type === 'C') {
        this.Sounds.ex_contamination.play();
      }
      console.log("PLAY CUE: ", cue)
    })

    this.Sounds = {
      explore1: new Howl({ src: 'assets/explore1.wav' }).volume(0.1),
      explore2: new Howl({ src: 'assets/explore2.wav' }).volume(0.1),
      explore3: new Howl({ src: 'assets/explore3.wav' }).volume(0.1),
      ex_contamination: new Howl({ src: 'assets/ex_contamination.wav' }).volume(0.1),
    }

    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/positions`)
      .valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((positions) => {
      this.positions = positions;
    })

    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks`).valueChanges().pipe(
      takeUntil(this.destroy$)
    ).subscribe((lm) => {
      this.landmarks = lm;
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

  adjustContamination(percent, level) {
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
            const contamValue = this.divisionService.getContaminantValue(level);
            this.landTiles[i].type = LandCardTypes.C;
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
      if (!this.isHost && card.type === LandCardTypes.R) {
        this.playExploreSound(card.value);
      }
      if (playerId) {
        this.takeAction(playerId);
      }
    }
    this.clearSelection(card.index);
    this.updateDB();
  }

  playExploreSound(value) {
    console.log("PLAY SOUND: ", value); 
    if (value == 1) {
      console.log('play explore sound: ', this.Sounds)
      this.Sounds.explore1.play();
    } else if (value == 2) {
      this.Sounds.explore2.play();
    } else if (value == 3) {
      this.Sounds.explore3.play();
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
    this.gatherResource.emit({ tile: card, playerId, safe });
    this.landTiles[card.index].value = -1;
    this.clearSelection(card.index);
    if (playerId) {
      this.takeAction(playerId);
    }
    this.updateDB();
  }

  updateDB() {
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
    if (!safe && tile.type === LandCardTypes.C && tile.harvested && !tile.owner) {
      this.Sounds.ex_contamination.play();
      await this.contaminateAdjacentTiles(tile);
      this.checkDiscoveries(tile);
    }
    this.updateDB();
  }

  checkDiscoveries(tile) {
    if (tile.value === 2 && !this.landmarks?.doubleContam) {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`).set({
        type: 'Contaminant',
        value: 2,
        data: this.divisionService.getContamDemoTileData(2),
        header: `A new type of contaminant has been uncovered`,
        message: `This contaminant can spread in two directions`,
      })
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks/doubleContam`).set(true);
    } else if (tile.value === 3 && !this.landmarks?.tripleContam) {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`).set({
        type: 'Contaminant',
        value: 3,
        data: this.divisionService.getContamDemoTileData(3),
        header: `A new type of contaminant has been uncovered`,
        message: `This contaminant can spread in ALL directions`,
      })
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks/tripleContam`).set(true);
    }
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
          }
        })
        resolve();
      })
    })
  }
}
