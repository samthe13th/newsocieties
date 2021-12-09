import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, map, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { each } from 'lodash';
import { DivisionService } from 'src/app/services/division-service.service';

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
    private bankService: BankService,
    private divisionService: DivisionService
  ) {}

  ngOnInit() {
    this.$divisionReview = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionReview`).valueChanges()
      .pipe(
        switchMap((toReview) => combineLatest(
          of(toReview),
          this.db.object(`shows/${this.showKey}/divisions/${toReview}/score`).valueChanges(),
          this.db.object(`shows/${this.showKey}/divisions/${toReview}/reserve`).valueChanges(),
          this.divisionService.$advancements(this.showKey, this.divisionKey),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/chartData`).valueChanges().pipe(
            map((data: any[]) => {
              console.log({data})
              const percent = data.reduce((acc, [_, c, a]) => (acc + ((a - c) / c) * 100), 0)
              console.log({percent})
              return `${Math.round(percent)}%`
            }),
          ),
          this.db.object(`shows/${this.showKey}/divisions/${toReview}/citizens`).valueChanges().pipe(
            map((citizens) => {
              let inHand = 0;
              each(citizens, (c) => {
                inHand += this.bankService.calculateWealth(c.resources);
              })
              return inHand;
            }),
            tap((hand) => console.log({hand}))
          ),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/localLand`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/globalLand`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/principles`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/resolutions`).valueChanges(),
          this.db.list(`shows/${this.showKey}/divisions/${toReview}/scenarios`).valueChanges(),
        )
      ),
      map(([code, score, reserve, advancements, exceededCapacity, inHand, localLand, globalLand, principles, resolutions, scenarios]) => ({
        code, score, reserve, advancements, exceededCapacity, inHand, localLand, globalLand, principles, resolutions, scenarios
      }))
    )
  }
}