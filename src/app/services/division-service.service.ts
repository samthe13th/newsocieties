import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { reduce, filter } from 'lodash';
import { pluckRandom } from '../utilties';

const SCORE = {
  low:  {
    VP: 0,
    capacity: 12,
    harvest: 18,
    landCost: 4,
    thresholds: [5, 10, 15]
  },
  midLow: {
    VP: 6,
    capacity: 18,
    harvest: 25,
    landCost: 5,
    thresholds: [7, 12, 17]
  },
  mid: {
    VP: 12,
    capacity: 24,
    harvest: 34,
    landCost: 6,
    thresholds: [9, 14, 19]
  },
  midHigh: {
    VP: 18,
    capacity: 30,
    harvest: 42,
    landCost: 8,
    thresholds: [11, 16, 21]
  },
  high: {
    VP: 24,
    capacity: 36,
    harvest: 50,
    landCost: 10,
    thresholds: [13, 18, 23]
  }
}

@Injectable({ providedIn: 'root' })
export class DivisionService {
  
  constructor(
    private db: AngularFireDatabase,
  ) {}

  acquireLand(showKey, divisionKey, data) {
    return new Promise((resolve) => {
      data.forEach(async (request) => {
        const landList = (divisionKey === request.division) ? 'localLand' : 'globalLand';
        await this.db.list(`shows/${showKey}/divisions/${request.division}/${landList}`).push(request);
        await this.db.list(`shows/${showKey}/divisions/${divisionKey}/pendingGLA`).push(request);
      })
      resolve(true);
    })
  }

  calculateDivisionScore$(showKey, divisionKey) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    
    return combineLatest(
      this.db.list(`${divisionPath}/globalLand`).valueChanges(),
      this.db.list(`${divisionPath}/localLand`).valueChanges(),
      this.db.object(`${divisionPath}/highthresholdsMet`).valueChanges(),
      this.db.object(`${divisionPath}/advancements`).valueChanges(),
    ).pipe(
      map(([
        globalLand,
        localLand,
        highthresholdsMet,
        advancements,
      ]: [ any, any, number, any ]) => {
        console.log({ globalLand, localLand, highthresholdsMet, advancements })
        const VP = (
          + (globalLand.length * 0.8)
          + localLand.length
          + highthresholdsMet
          + (0.35 * reduce(advancements, (acc, A) => A.individual + A.communal + acc, 0))
        );
        return { VP, score: this.getScore(VP) }
      }),
      tap((updates) => {
        console.log({updates})
        this.db.object(divisionPath).update(updates)
      })
    )
  }

  getScore(VP) {
    if (VP < SCORE.midLow.VP) {
      return 'low'
    } else if (VP < SCORE.mid.VP) {
      return 'midLow'
    } else if (VP < SCORE.midHigh.VP) {
      return 'mid'
    } else if (VP < SCORE.high.VP) {
      return 'midHigh'
    }
    return 'high'
  }

  async setLandTiles(showKey, divisionKey) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    const pendingGLA = await this.db.list(`${divisionPath}/pendingGLA`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    const landTiles: any = await this.db.object(`${divisionPath}/landTiles`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    const freePlots = filter(landTiles, (tile) => tile.owner === undefined);

    const plotIndexes: number[] = pluckRandom(freePlots, pendingGLA.length)
      .map(tile => tile.index);

    await this.db.object(`${divisionPath}/pendingGLA`).remove();

    plotIndexes.forEach((plotIndex, i) => {
      landTiles[plotIndex].owner = pendingGLA[i]
    })
    
    return new Promise((resolve) => {
      this.db.object(`${divisionPath}/landTiles`)
        .set({ ...landTiles })
        .then(() => {
          resolve(landTiles);
        })
    })
  }

  async newSeason(showKey, divisionKey) {
    console.log("NEW SEASON");
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;

    this.db.object(divisionPath)
      .valueChanges()
      .pipe(take(1))
      .subscribe((division: any) => {
        console.log("SCORE: ", division?.season, division?.score, SCORE[division?.score])
        this.db.object(`${divisionPath}/nextSeason`).set({
          season: division?.season + 1,
          ...SCORE[division?.score]
        })
      })
  }
}