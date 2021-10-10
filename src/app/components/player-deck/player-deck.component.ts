import { Component, Input } from '@angular/core';
import { slice } from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

  @Input() id;
  @Input() name = "Sam"
  @Input() showKey: string;
  @Input() division;

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
    console.log({show, division, id})
    this.$citizen = this.db.object(`shows/${show}/divisions/${division}/citizens/${id}`)
      .valueChanges()
      .pipe(
        tap((citizen) => {
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
      this.bank.depositResources(this.showKey, this.division?.code, this.id, [{
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