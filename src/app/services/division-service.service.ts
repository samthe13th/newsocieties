import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { reduce, lowerCase } from 'lodash';

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
    private route: ActivatedRoute
    ) {}

    calculateDivisionScore$(showKey, divisionKey) {
      const divisionPath = `shows/${showKey}/divisions/${divisionKey}`;
      
      return combineLatest(
        this.db.object(`${divisionPath}/globalLand`).valueChanges(),
        this.db.object(`${divisionPath}/localLand`).valueChanges(),
        this.db.object(`${divisionPath}/highthresholdsMet`).valueChanges(),
        this.db.object(`${divisionPath}/advancements`).valueChanges(),
      ).pipe(
        map(([
          globalLand,
          localLand,
          highthresholdsMet,
          advancements
        ]: [ number, number, number, any]) => {
          console.log({ globalLand, localLand, highthresholdsMet, advancements})
          const VP = (
            + (globalLand * 0.8)
            + localLand
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

    newSeason(showKey, divisionKey) {
      const divisionPath = `shows/${showKey}/divisions/${divisionKey}`
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