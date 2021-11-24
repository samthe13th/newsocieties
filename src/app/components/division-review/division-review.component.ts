import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, map, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';

@Component({
  selector: 'app-division-review',
  templateUrl: './division-review.component.html',
  styleUrls: ['./division-review.component.scss'],
  host: {
    '[class.app-division-review]': 'true',
  }
})
export class DivisionReviewComponent implements OnInit {
  $divisionReview;

  @Input() divisionKey;
  @Input() showKey;

  constructor(
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    this.$divisionReview = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionReview`).valueChanges()
      .pipe(
        switchMap((toReview) => combineLatest(
          of(toReview),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/principles`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/resolutions`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/scenarios`).valueChanges()
        )
      ),
      map(([code, principles, resolutions, scenarios]) => ({
        code, principles, resolutions, scenarios
      }))
    )
  }
}