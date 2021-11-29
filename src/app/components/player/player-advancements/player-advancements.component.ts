import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { faArchway, faBriefcaseMedical, faShieldAlt, faBrain, faTheaterMasks } from '@fortawesome/free-solid-svg-icons';

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

  @Input() divisionKey: string;
  @Input() showKey: string;
  @Input() playerId: string;

  kIcon = faBrain;
  aIcon = faTheaterMasks;
  iIcon = faArchway;
  sIcon = faShieldAlt;
  hIcon = faBriefcaseMedical;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$data = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/advancementCosts`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens/${this.playerId}/advancements`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/color`).valueChanges(),
    ).pipe(
      map(([costs, adv, color]) => ({ costs, adv, color }))
    )
  }

  advCost(adv, costs) {
    if (adv >= 2) return costs[2];
    if (adv == 1) return costs[1];
    return costs[0];
  }
}