import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { capitalize } from 'lodash';

@Component({
  selector: 'app-advancement-summary',
  templateUrl: './advancement-summary.component.html',
  styleUrls: ['./advancement-summary.component.scss'],
  host: {
    '[class.app-advancement-summary]': 'true',
  }
})
export class AdvancementSummaryComponent {
  $advSummary: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  @Input() showKey;
  @Input() divisionKey;

  ngOnInit() {
    this.$advSummary = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/advancements`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens`).valueChanges(),
    ).pipe(
      map(([adv, citizens]) => {
        return Object.keys(adv).map((key) => ({
          type: capitalize(key),
          total: adv[key].communal + adv[key].individual,
          benefit: adv[key].reward.text,
          contributors: citizens
            .map((c: any) => ({ name: c?.name, contributions: c.advancements[key] }))
            .filter((c:any) => c.contributions !== 0)
        }))
      }),
      tap((data) => console.log({data}))
    )
  }
}