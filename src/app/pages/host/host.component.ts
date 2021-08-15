import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { getRandomInt, pluckRandom } from 'src/app/utilties';
import { LandTile, LandCardValues } from 'src/app/interfaces';
import { includes, range, difference } from 'lodash';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {
  division;
  contamination;
  harvest;

  divisionId;
  showId;
  divisionPath;
  landTilesPath;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.divisionId = this.route.snapshot.params.division;
    this.showId = this.route.snapshot.params.show;
    this.divisionPath = `shows/${this.showId}/divisions/${this.divisionId}`;
    
    this.landTilesPath = `${this.divisionPath}/landTiles`

    this.db.object(this.divisionPath)
      .valueChanges()
      .subscribe((division) => {
        this.division = division
      })

    this.db.object(`shows/${this.showId}/contamination/current`)
      .valueChanges()
      .subscribe((level) => {
        this.adjustContamination(level);
      })
  }

  newSeason() {
    const { landTiles, harvest } = this.division;
    this.harvest = this.generateHarvest(landTiles, harvest);
    this.db.object(`${this.divisionPath}/landTiles`).set({ ...this.harvest })
    console.log('NEW HARVEST: ', this.harvest)
  }

  private adjustContamination(level) {
    console.log('adjust contam')
    this.contamination = level;
    if (this.harvest) {
      const cardIndexes = this.harvest
        .map((tile, index) => tile.value == LandCardValues.EMPTY ? -1 : index)
        .filter(value => value !== -1);
      const contaminantsCount = Math.ceil((this.contamination / 100) * cardIndexes.length)
      const currentContaminantIndexes = this.harvest
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
          if (!this.harvest[i].harvested) {
            this.harvest[i].value = LandCardValues.CONTAM;
          }
        })
      } else if (adjustment < 0) {
        const uncontaminate = pluckRandom(currentContaminantIndexes, Math.min(Math.abs(adjustment), currentContaminantIndexes.length));
        console.log('Remove contams: ', uncontaminate)
        uncontaminate.forEach((i) => {
          if (!this.harvest[i].harvested) {
            this.harvest[i].value = getRandomInt(1,3);
          }
        })
      }
    }
  }

  private generateHarvest(landTiles, harvestableCards): Array<LandTile> {
    const tiles: LandTile[] = [ ...this.resetLandTiles(landTiles) ];
    const harvest: number[] = pluckRandom(range(tiles.length), harvestableCards);
    const contaminantsCount = Math.ceil((this.contamination / 100) * harvestableCards);
    const contaminants: number[] = pluckRandom(harvest, contaminantsCount);

    harvest.forEach((i) => {
      tiles[i].value = includes(contaminants, i) ? 0 : getRandomInt(1,3)
    })

    return tiles;
  }

  private resetLandTiles(tiles) {
    return tiles.map((tile) => ({
      ...tile,
      value: -1,
      contaminated: false,
      mark: null,
      harvested: false
    }))
  }
}
