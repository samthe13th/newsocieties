import { Component, Input } from '@angular/core';
import { slice } from 'lodash';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { tap, find, take } from 'rxjs/operators';
import { LandCardValues } from 'src/app/interfaces';
import { BankService } from 'src/app/services/bank.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-player-deck',
  templateUrl: './player-deck.component.html',
  styleUrls: ['./player-deck.component.scss'],
  host: {
    '[class.app-player-deck]': 'true'
  }
})
export class PlayerDeckComponent {
  $resources: Observable<any>;
  $citizen: Observable<any>;

  private _achievements: {
    safety: [],
    health: [],
    arts: [],
    knowledge: [],
    infastructure: []
  }

  wealth = 0;
  playerIndex;

  @Input() id;
  @Input() name = "Sam"
  @Input() showKey: string;
  @Input() division;
  @Input() myTurn: boolean;

  constructor(
    private route: ActivatedRoute,
    private bank: BankService,
    private db: AngularFireDatabase,
  ) {
  }

  ngOnInit() {
    console.log('division: ', this.division)
    // this.resources = sortBy(this.resources, 'value');
    const { show, division, id } = this.route.snapshot.params;
    this.subToCitizen(show, division, id);
  }

  async subToCitizen(showKey, divisionKey, id) {
    const citizenPath = `shows/${showKey}/divisions/${divisionKey}/citizens`;
    const citizens = await this.db.list(citizenPath).valueChanges().pipe(take(1)).toPromise();
    this.playerIndex = _.findIndex(citizens, ['id', id]);

    console.log({citizenPath, citizens})
    this.$citizen = this.db.object(`${citizenPath}/${this.playerIndex}`)
      .valueChanges()
      .pipe(
        tap((citizen) => {
          console.log({citizen})
          if (!citizen) return;
          this.wealth = citizen.resources 
            ? citizen.resources.reduce((acc, R) => acc + R.value, 0)
            : 0;
          console.log("wealth: ", this.wealth)
        })
      )
  }

  public add(R) {
    console.log({R})
    if (R.value === LandCardValues.CONTAM) {
      this.contaminateResources()
    } else {
      console.log('make deposit')
      this.bank.depositResources(this.showKey, this.division?.code, this.playerIndex, [{
        ...R,
        division: this.division?.code
      }])
    }
  }

  private contaminateResources() {
    console.log('contam... ')
  //   const toDestroy = Math.ceil(this.resources.length / 2);
  //   const destroyMsg = toDestroy > 0 
  //     ? ` ${formatPlural(toDestroy, 'resource has', 'resources have')} been destroyed`
  //     : ''

  //   this.resources = slice(this.resources, toDestroy)
  //   this.calculateWealth();

  //   window.alert(`You gathered a contaminant!${destroyMsg}`);
   }
}

function formatPlural(num, singular, plural) {
  return num == 1 ? `${num} ${singular}` : `${num} ${plural}`;
}