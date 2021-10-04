import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import { find } from 'lodash';

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

  $max;
  min = 0;
  writePath;
  fundsKey;
  divisionPath;
  totalFunds: number;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    console.log(this.showKey, this.divisionKey)
    this.divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.$funds = this.db.list(`${this.divisionPath}/vote/funds`).valueChanges();
    this.$funds.subscribe((funds) => {
      this.totalFunds = this.addAllFunds(funds);
      this.fundsChange.emit(this.totalFunds);
    })
    if (!this.isCentral && this.playerId) {
      const citizenPath = `${this.divisionPath}/citizens/${this.playerId}`;
      this.db.object(citizenPath).valueChanges()
        .pipe(take(1))
        .subscribe((c: any) => {
          this.writePath = `${this.divisionPath}/vote/funds/${this.playerId}/value`;
          this.fundsKey = `${this.playerId}-${c.name}`;
          this.db.object(`${this.divisionPath}/vote/funds/${this.playerId}`).update({ 
            key: this.fundsKey,
            name: c.name
          })
        })
      this.$max = this.db.list(`${citizenPath}/resources`)
        .valueChanges()
        .pipe(
          map((resources: number[]) => {
            return resources.reduce((acc, R) => acc + R, 0);
          })
        )
    } else {
      this.fundsKey = 'reserve';
      this.writePath = `${this.divisionPath}/vote/funds/reserve/value`;
      this.db.object(`${this.divisionPath}/vote/funds/reserve`).update({ 
        key: 'reserve',
        name: 'Reserve'
      })
      this.$max = this.db.list(`${this.divisionPath}/reserve`)
        .valueChanges()
        .pipe(
          map((resources: number[]) => {
            console.log("resources: ", resources)
            return resources.reduce((acc, R) => acc + R, 0)
          })
        )
    }
  }

  takeBack(amount) {
    console.log('take back ', amount);
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