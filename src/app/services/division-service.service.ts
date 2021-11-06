import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { reduce, filter } from 'lodash';
import { pluckRandom } from '../utilties';
const ADVANCEMENTS = ["safety", "health", "arts", "knowledge", "infrastructure"];

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

  addCitizen(showKey, divisionKey, id, name) {
    console.log('add citizen', showKey, divisionKey, id, name);
    return new Promise((resolve) => {
      this.db.object(`shows/${showKey}/divisions/${divisionKey}/citizens/${id}`).set({
        name,
        actions: 2,
        id,
        advancements: {
          safety: 0, 
          health: 0,
          arts: 0,
          knowledge: 0,
          infrastructure: 0
        }
      }).then(() => resolve())
    })
  }

  async transferCitizen(showKey, oldDivisionKey, newDivisionKey, code) {
    const path = `shows/${showKey}/divisions/${oldDivisionKey}/citizens/${code}`;
    const citizen: any = await this.db.object(path).valueChanges().pipe(take(1)).toPromise();
    await this.db.object(path).remove();
    console.log("TRANSFER: ", path, citizen)
    return new Promise((resolve) => {
      this.db.object(`shows/${showKey}/divisions/${newDivisionKey}/citizens/${code}`).set(
        { ...citizen, actions: 2 }
      ).then(() => resolve())
    })
  }

  expelCitizen(showKey, divisionKey, code, ban=false) {

  }

  acquireLand(showKey, divisionKey, data) {
    return new Promise((resolve) => {
      data.forEach(async (request) => {
        const landList = (divisionKey === request.division) ? 'localLand' : 'globalLand';
        await this.db.list(`shows/${showKey}/divisions/${request.division}/${landList}`).push(request);
        await this.db.list(`shows/${showKey}/divisions/${divisionKey}/pendingGLA`).push(request);
      })
      console.log('aquire: ', data)
      resolve(true);
    })
  }

  thresholdListener$(showKey, divisionKey) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;

    return combineLatest(
      this.db.object(`${divisionPath}/reserve`).valueChanges(),
      this.db.object(`${divisionPath}/reserveThresholds`).valueChanges(),
      this.db.object(`${divisionPath}/highThresholdMet`).valueChanges()
    ).pipe(
      map(([
        reserve,
        reserveThresholds,
        highThresholdMet
      ]: [number,any, boolean]) => {
        console.log({reserve, reserveThresholds, highThresholdMet})
        if (!highThresholdMet && reserveThresholds.high <= reserve) {
          console.log('update: ', reserve, reserveThresholds, highThresholdMet)
          this.db.object(`${divisionPath}/highThresholdMet`).set(true);
          this.db.object(`${divisionPath}/highThresholdsMet`)
            .query.ref.transaction(met => ++met ?? 1);
        }
      })
    )
  }

  calculateDivisionScore$(showKey, divisionKey) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    
    return combineLatest(
      this.db.list(`${divisionPath}/globalLand`).valueChanges(),
      this.db.list(`${divisionPath}/localLand`).valueChanges(),
      this.db.object(`${divisionPath}/highThresholdsMet`).valueChanges(),
      this.db.object(`${divisionPath}/advancements`).valueChanges()
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
        return { VP: round(VP), score: this.getScore(VP) }
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

function round(number) {
  return Math.round(number * 100) / 100;
}