import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { combineLatest } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { reduce, filter, slice } from 'lodash';
import { pluckRandom } from '../utilties';
const ADVANCEMENTS = ["safety", "health", "arts", "knowledge", "infrastructure"];

const SCORE = {
  low:  {
    VP: 0,
    capacity: 12,
    harvest: 18,
    landCost: 4,
    thresholds: [5, 10, 15],
  },
  midLow: {
    VP: 6,
    capacity: 18,
    harvest: 25,
    landCost: 5,
    thresholds: [7, 12, 17],
  },
  mid: {
    VP: 12,
    capacity: 24,
    harvest: 34,
    landCost: 6,
    thresholds: [9, 14, 19],
  },
  midHigh: {
    VP: 18,
    capacity: 30,
    harvest: 42,
    landCost: 8,
    thresholds: [11, 16, 21],
  },
  high: {
    VP: 24,
    capacity: 36,
    harvest: 49,
    landCost: 10,
    thresholds: [13, 18, 23],
  }
}

@Injectable({ providedIn: 'root' })
export class DivisionService {
  
  constructor(
    private db: AngularFireDatabase,
  ) {}

  addCitizen(showKey, divisionKey, id, name) {
    return new Promise((resolve) => {
      this.db.object(`shows/${showKey}/divisions/${divisionKey}/citizens/${id}`).set({
        name,
        actions: 0,
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
    return new Promise((resolve) => {
      this.db.object(`shows/${showKey}/divisions/${newDivisionKey}/citizens/${code}`).set(
        { ...citizen, actions: 0 }
      ).then(() => resolve())
    })
  }

  async assignLocalLand(showKey, divisionKey, request) {
    console.log("assign local land: ", request);
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    const landTiles: any = await this.db.object(`${divisionPath}/landTiles`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    const freePlots = filter(landTiles, (tile) => tile.owner === undefined);
    const plotIndex = pluckRandom(freePlots, 1)[0].index;
    
    console.log("plot index: ", plotIndex, "owner: ", request.id)
    landTiles[plotIndex].owner = request;
    
    return new Promise((resolve) => {
      this.db.object(`${divisionPath}/landTiles`)
        .set({ ...landTiles })
        .then(() => {
          resolve(landTiles);
        })
    })
  }


  acquireLand(showKey, divisionKey, data) {
    return new Promise((resolve) => {
      data.forEach(async (request) => {
        console.log('acquire plot for ', data)
        const landList = (divisionKey === request.division) ? 'localLand' : 'globalLand';
        await this.db.object(`shows/${showKey}/divisions/${request.division}/citizens/${request.id}/land`)
          .query.ref.transaction((land) => land ? ++land : 1)
        await this.db.list(`shows/${showKey}/divisions/${request.division}/${landList}`).push(request);
        if (landList === 'globalLand') {
          await this.db.list(`shows/${showKey}/divisions/${divisionKey}/pendingGLA`).push(request);
        } else {
          console.log('Get local plot')
          this.assignLocalLand(showKey, divisionKey, request);
        }
      })
      resolve();
    })
  }

  async getThresholdLevel(showKey, divisionKey) {
    console.log('validate')
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;

    return new Promise((resolve) => {
      combineLatest(
        this.db.object(`${divisionPath}/reserve`).valueChanges(),
        this.db.object(`${divisionPath}/reserveThresholds`).valueChanges()
      ).pipe(
        take(1),
        map(([reserve,reserveThresholds]: [number,any]) => {
          console.log({reserve, reserveThresholds});
          this.db.object(`${divisionPath}/highThresholdMet`).set(false);
          if (reserveThresholds.high <= reserve) {
            console.log("raise threshold");
            this.db.object(`${divisionPath}/highThresholdMet`).set(true);
            this.db.object(`${divisionPath}/highThresholdsMet`).query
              .ref.transaction(met => met ? ++met : 1).then(() => {
                resolve(4);
              })
          } else if (reserveThresholds.mid <= reserve) {
            resolve(3);
          } else if (reserveThresholds.low <= reserve) {
            resolve(2);
          } else {
            resolve(1);
          }
        })
      ).subscribe();
    })
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
        const VP = (
          + (globalLand.length * 0.8)
          + localLand.length
          + highthresholdsMet
          + (0.35 * reduce(advancements, (acc, A) => A.individual + A.communal + acc, 0))
        );
        return { VP: round(VP), score: this.getScore(VP) }
      }),
      tap((updates) => {
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

  async contaminateResources(showKey, divisionKey, playerId) {
    const dbPath = `shows/${showKey}/divisions/${divisionKey}/citizens/${playerId}`;
    const citizen: any = await this.db.object(dbPath)
      .valueChanges()
      .pipe(take(1))
      .toPromise()
    const resources = citizen?.resources;

    return new Promise((resolve) => {
      if (resources) {
        const toDestroy = Math.ceil(resources.length / 2);
        const adjustedResources = slice(resources, toDestroy);
        const toastMessage = toDestroy > 0 
          ? `Half of collected resources been destroyed`
          : ''
        this.db.object(dbPath).update({
          resources: adjustedResources
        }).then(() => {
          resolve(toastMessage)
        })
      } else {
        resolve(null)
      }
    })
  }

  async setLandTiles(showKey, divisionKey) {
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    const pendingGLA: any = await this.db.list(`${divisionPath}/pendingGLA`)
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
    const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
    this.db.object(divisionPath)
      .valueChanges()
      .pipe(take(1))
      .subscribe((division: any) => {
        const updates = SCORE[division?.score];
        const capacity = division?.highThresholdMet
          ? division?.capacity + 1
          : division?.capacity;
        console.log('capacity: ', capacity, updates.capacity)
        this.db.object(`${divisionPath}/nextSeason`).set({
          season: division?.season + 1,
          contaminantLevel: division?.contaminantLevel < 3
            ? division?.contaminantLevel + 1
            : division?.contaminantLevel,
          ...updates,
          capacity: Math.max(updates.capacity, capacity)
        })
      })
  }
}

function round(number) {
  return Math.round(number * 100) / 100;
}

function formatPlural(num, singular, plural) {
  return num == 1 ? `${num} ${singular}` : `${num} ${plural}`;
}