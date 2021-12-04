import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { toNumber } from 'lodash';

const DIVISIONS = ["N", "NE", "W", "NW", "E", "SW", "S", "SE"];

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  host: {
    '[class.app-banner]': 'true'
  }
})
export class BannerComponent {
  $flashNews: Observable<any>;
  $loaded: Observable<any>;
  $reserveData: Observable<any>;
  $global: Observable<any>;
  $playerViews: Observable<any>;
  $playerViewHighlight: Observable<any>;
  $divisionName: Observable<any>;

  divisionsLoaded = new Subject<boolean>();
  reserveLoaded = new Subject<boolean>();

  DivisionSummaries

  @Output() bannerChange = new EventEmitter<any>();

  @Input() showKey;
  @Input() divisionKey;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.$playerViewHighlight = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViewHighlight`).valueChanges().pipe(
      tap((x) => console.log("highlight: ", x))
    )
    this.$playerViews = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViews`).valueChanges();
    this.$divisionName = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/name`).valueChanges();
    this.$global = this.db.object(`shows/${this.showKey}/global`).valueChanges();
    this.$loaded = combineLatest(
      of(this.reserveLoaded),
      of(this.divisionsLoaded)
    )
    this.$reserveData = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserveThresholds`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/color`).valueChanges()
    ).pipe(
      map(([reserve, thresholds, color]: [any, any, string]) => {
        console.log('test: ', thresholds, toNumber(reserve), toNumber(thresholds.high), toNumber(reserve) / toNumber(thresholds.high ))
        return {
          reserve: {
            value: reserve,
            percent: Math.min(100, toPercent(reserve, thresholds.high))
          },
          thresholds: [
            { 
              value: thresholds.low,
              percent: toPercent(thresholds.low, thresholds.high),
            },
            {
              value: thresholds.mid,
              percent: toPercent(thresholds.mid, thresholds.high),
            },
            {
              value: thresholds.high,
              percent: 100
            }
          ],
          color
        }
      }),
      tap(() => this.reserveLoaded.next())
    )
    this.DivisionSummaries = DIVISIONS.map((division) => (
      this.db.object(`shows/${this.showKey}/divisions/${division}`).valueChanges().pipe(
        map((division: any) => ({
          season: division.season,
          score: division.score,
          code: division.code,
          color: division.color
        })),
        tap(() => this.divisionsLoaded.next())
      )
    ))
    
    this.$flashNews = this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/news`,
    ).valueChanges()
    .pipe(
      tap((x) => console.log('tap: ', x)),
    )
  }

  thresholdColor(reserve, thresholds) {
    if (reserve > thresholds.high) {
      return 'green'
    }
    if (reserve > thresholds.mid) {
      return 'blue'
    }
    return 'yellow'
  }
}

function toPercent(n, d) {
  return Math.round((toNumber(n) / toNumber(d)) * 100)
}