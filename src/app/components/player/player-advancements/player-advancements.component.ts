import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest, Subject } from 'rxjs';
import { tap, map, takeUntil } from 'rxjs/operators';
import { each } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { faArchway, faBriefcaseMedical, faShieldAlt, faBrain, faTheaterMasks } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';


@Component({
  selector: 'app-player-advancements',
  templateUrl: './player-advancements.component.html',
  styleUrls: ['./player-advancements.component.scss'],
  host: {
    '[class.app-player-advancements]': 'true'
  }
})
export class PlayerAdvancementsComponent implements OnInit {
  $advancements: Observable<any>;
  $costs: Observable<any>;
  $data: Observable<any>;

  private destroy$ = new Subject<boolean>();

  @Input() divisionKey: string;
  @Input() showKey: string;
  @Input() playerId: string;

  kIcon = faBrain;
  aIcon = faTheaterMasks;
  iIcon = faArchway;
  sIcon = faShieldAlt;
  hIcon = faBriefcaseMedical;

  landmarks;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks`).valueChanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((LM) => {
        this.landmarks = LM
      })
    this.$data = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/advancementCosts`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens/${this.playerId}`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/color`).valueChanges(),
    ).pipe(
      map(([costs, citizen, color]: [any, any, any]) => (
        { 
          costs,
          adv: citizen?.advancements,
          name: citizen?.name,
          color
        })), 
      tap((data) => {
        each(data?.adv, (adv: any, key: string) => {
          if (adv >= 3 && !this.landmarks?.[`${key}Achieved`]) {
            this.db.list(`shows/${this.showKey}/feeds/${this.divisionKey}`).push({
              from: this.divisionKey,
              type: 'advancement',
              header: 'Advancement',
              value: `${data.name} has made 3 contributions to ${key}`,
              timestamp: moment().format('h:mm:ss')
            })
            this.db.object(`shows/${this.showKey}/centralUnseen/${this.divisionKey}`)
              .query.ref.transaction((unseen) => ++unseen)
            this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`).set({
              type: 'Advancements',
              header: `Advancement`,
              value: key,
              message: `${data.name} has made 3 contributions to ${key}`,
            })
            this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks/${key}Achieved`).set(true)
          }
        })
      })
    )
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  advCost(adv, costs) {
    if (adv >= 2) return costs[2];
    if (adv == 1) return costs[1];
    return costs[0];
  }
}