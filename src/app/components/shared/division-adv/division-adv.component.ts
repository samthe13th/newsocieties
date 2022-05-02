import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-division-adv',
  templateUrl: './division-adv.component.html',
  styleUrls: ['./division-adv.component.scss'],
  host: {
    '[class.app-division-adv]': 'true',
  }
})
export class DivisionAdvComponent implements OnInit {
  $advancements: Observable<any>;
  @Input() divisionKey;
  @Input() showKey;
  @Input() color: 'white' | 'black' = 'black';

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$advancements = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/advancements`).valueChanges()
      .pipe(
        map((adv: any) => ({
          safety: adv?.safety?.individual + adv?.safety?.communal,
          health: adv?.health?.individual + adv?.health?.communal,
          arts: adv?.arts?.individual + adv?.arts?.communal,
          knowledge: adv?.knowledge?.individual + adv?.knowledge?.communal,
          infrastructure: adv?.infrastructure?.individual + adv?.infrastructure?.communal,
        }))
      )
  }
}