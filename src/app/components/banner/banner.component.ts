import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
  DivisionSummaries

  @Output() bannerChange = new EventEmitter<any>();

  @Input() showKey;
  @Input() divisionKey;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.DivisionSummaries = DIVISIONS.map((division) => (
      this.db.object(`shows/${this.showKey}/divisions/${division}`).valueChanges().pipe(
        map((division: any) => ({
          season: division.season,
          score: division.score,
          code: division.code,
          color: division.color
        }))
      )
    ))
    
    this.$flashNews = this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/news`,
    ).valueChanges()
    .pipe(
      tap((x) => console.log('tap: ', x)),
    )
  }
}