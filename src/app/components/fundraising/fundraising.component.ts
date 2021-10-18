import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take, tap } from 'rxjs/operators';
import { find, findIndex } from 'lodash';

@Component({
  selector: 'app-fundraising',
  templateUrl: './fundraising.component.html',
  styleUrls: ['./fundraising.component.scss'],
  host: {
    '[class.app-fundraising]': 'true'
  }
})
export class FundraisingComponent {
  $funds;

  @Output() fundsChange = new EventEmitter<number>();

  @Input() isCentral = false;
  @Input() playerId: string;
  @Input() showKey: string;
  @Input() divisionKey: string;

  max = 10000;
  min = 0;
  writePath;
  fundsKey;
  divisionPath;
  totalFunds: number;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    console.log('FUNDRAISING: ', this.showKey, this.divisionKey);
    this.divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.$funds = this.db.list(`${this.divisionPath}/vote/funds`).valueChanges();
    this.$funds.subscribe((funds) => {
      console.log('funds: ', funds)
      this.totalFunds = this.addAllFunds(funds);
      this.fundsChange.emit(this.totalFunds);
    })
    if (!this.isCentral && this.playerId) {
      this.subscribeToPlayerResources();
    } else {
      this.fundsKey = 'reserve';
      this.writePath = `${this.divisionPath}/vote/funds/reserve/value`;
      this.db.object(`${this.divisionPath}/vote/funds/reserve`).update({ 
        key: 'reserve',
        name: 'Reserve'
      })
      this.db.object(`${this.divisionPath}/reserve`).valueChanges().subscribe((x:number) => {
        this.max = x;
      });
    }
  }

  async subscribeToPlayerResources() {
    const citizenPath = `${this.divisionPath}/citizens`;
    const citizens = await this.db.list(citizenPath)
      .valueChanges()
      .pipe(take(1))
      .toPromise();
    const playerIndex = findIndex(citizens, ['id', this.playerId]);
    console.log('!! ', citizens, this.playerId, `${citizenPath}/${playerIndex}`)
    this.db.object(`${citizenPath}/${playerIndex}`).valueChanges()
      .pipe(take(1))
      .subscribe((c: any) => {
        this.writePath = `${this.divisionPath}/vote/funds/${playerIndex}/value`;
        this.fundsKey = `${this.playerId}-${c.name}`;
        this.db.object(`${this.divisionPath}/vote/funds/${playerIndex}`).update({ 
          key: this.fundsKey,
          name: c.name
        })
      });

    this.db.list(`${citizenPath}/${playerIndex}/resources`)
      .valueChanges()
      .pipe(
        tap((x) => console.log({x})),
        map((resources: number[]) => resources.reduce(
          (acc, R: any) => R?.value ? acc + R.value : acc, 0)
        )
      ).subscribe((x) => { this.max = x;  console.log('max: ', this.max) })
  }

  takeBack(amount) {
    if (this.isCentral) {
      this.db.object(`${this.divisionPath}/vote/funds/reserve/value`).set(0);
    } else {
      this.db.object(`${this.divisionPath}/vote/funds/${this.playerId}/value`).set(0);
    }
  }

  addAllFunds(funds) {
    return funds
      ? funds.reduce((acc, citizen) => citizen?.value ? (acc + citizen.value) : acc, 0)
      : 0
  }

  fundsAdded(funds) {
    return find(funds, (f => f?.value && f.key === this.fundsKey))
  }
}