import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, combineLatest, Subject } from 'rxjs';
import { DivisionService } from 'src/app/services/division-service.service';

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
  
  showBenefits: boolean | null = false;

  private destroy$ = new Subject<boolean>();

  constructor(
    private db: AngularFireDatabase,
    private divisionService: DivisionService
  ) {}

  @Input() showKey;
  @Input() divisionKey;
  @Input() role: 'citizen' | 'host';

  ngOnInit() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/showBenefit`)
      .valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((showBenefits: boolean | null) => {
        this.showBenefits = showBenefits;
      })

    this.$advSummary = combineLatest(
      this.divisionService.$advancements(this.showKey, this.divisionKey),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens`).valueChanges(),
    ).pipe(
      map(([advancements, citizens]) => {
        return advancements.map((adv) => ({
          type: adv.name,
          icon: `/assets/${adv.key}.png`,
          total: adv.communal + adv.individual,
          benefit: adv.reward.text,
          contributors: citizens
            .map((c: any) => ({ name: c?.name, contributions: c.advancements[adv.key] }))
            .filter((c:any) => c.contributions !== 0)
        }))
      })
    )
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  toggleShowBenefit() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/showBenefit`).query.ref.transaction(show => show ? false : true)
  }
}