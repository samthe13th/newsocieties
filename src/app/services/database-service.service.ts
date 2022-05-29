
import { Injectable } from '@angular/core';
import { DivisionService } from './division-service.service';
import { AngularFireDatabase } from '@angular/fire/database/database';
import { combineLatest } from 'rxjs';
import * as rx from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(
    private db: AngularFireDatabase,
    private divisionService: DivisionService
  ) {}

  getDivisionObject = (showKey, divisionKey, prop) => this.db.object(`${divisionPath(showKey, divisionKey)}/${prop}`).valueChanges();

  getDivisionList = (showKey, divisionKey, prop) => this.db.list(`${divisionPath(showKey, divisionKey)}/${prop}`).valueChanges();

  getAdvancements = (showKey, divisionKey) => this.divisionService.$advancements(showKey, divisionKey);

  getDivision = (showKey, divisionKey) => this.db.object(divisionPath(showKey, divisionKey)).valueChanges();

  getDivisionReview = (showKey, divisionKey) => this.db.object(`${divisionPath(showKey, divisionKey)}/divisionReview`).valueChanges();

  getExports = (showKey, divisionKey) => this.db.list(`${divisionPath(showKey, divisionKey)}/exports`).valueChanges().pipe(
    rx.map((exports) => exports.reverse())
  )

  getPageState = (showKey, divisionKey) => this.db.object(`${divisionPath(showKey, divisionKey)}/focus`).valueChanges().pipe(
    rx.map(focus => focus !== 'new-season' ? 'main' : 'newSeason')
  )

  getPlayerView = (showKey, divisionKey) => combineLatest(
    this.db.object(`${divisionPath(showKey, divisionKey)}/playerViewHighlight`).valueChanges(),
    this.db.object(`${divisionPath(showKey, divisionKey)}/playerViews`).valueChanges()
  ).pipe(
    rx.map(([highlight, views]) => ({highlight, views}))
  )

  getReserveData(showKey, divisionKey) {
    const dp = divisionPath(showKey, divisionKey);
    return combineLatest(
        this.db.object(`${dp}/reserve`).valueChanges(),
        this.db.object(`${dp}/reserveThresholds`).valueChanges(),
        this.db.object(`${dp}/color`).valueChanges(),
        this.db.object(`${dp}/nextSeason/harvest`).valueChanges()
    ).pipe(
        rx.map(
            ([reserve, thresholds, color, harvest]: [any, any, string, number]) => {
            return {
              reserve: {
                value: reserve,
                percent: Math.min(100, toPercent(reserve, thresholds.high))
              },
              thresholds: [
                { value: thresholds.low, percent: toPercent(thresholds.low, thresholds.high) },
                { value: thresholds.mid, percent: toPercent(thresholds.mid, thresholds.high) },
                { value: thresholds.high, percent: 100 }
              ],
              color,
              deck: this.divisionService.getDeck(reserve, thresholds, harvest)
            };
          }
        )
    );
  }

  getTurnButtons = (showKey, divisionKey) => this.db.list(`${divisionPath(showKey, divisionKey)}/citizens`).valueChanges()
    .pipe(
        rx.map((citizens: any) => citizens.map((c, index) => ({ id: c.id, label: index + 1 })))
    )
}

function divisionPath(showKey, divisionKey) {
    return `shows/${showKey}/divisions/${divisionKey}`;
}

function toPercent(n, d) {
    return Math.round((_.toNumber(n) / _.toNumber(d)) * 100);
}
