
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toNumber } from 'lodash';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(private db: AngularFireDatabase) {

  }

  async removeFromReserve(divisionPath, amount) {
    const reservePath = `${divisionPath}/reserve`;
    const reserve = await this.db.object(reservePath).valueChanges()
      .pipe(take(1))
      .toPromise();

    const difference = Math.max(0, toNumber(reserve) - amount)

    console.log('remove from reserve: ', reserve, amount);
    this.db.object(reservePath).set(difference);
  }

  async addToReserve(divisionPath, amount) {
    const reservePath = `${divisionPath}/reserve`;
    const reserve = await this.db.object(reservePath).valueChanges()
      .pipe(take(1))
      .toPromise();

    console.log('add to reserve');
    this.db.object(reservePath).set(toNumber(reserve) + amount);
  }

  async spendResources(resourcePath, cost) {
    let spend = 0;
    let transactions = 0;
    const resources: any[] = await this.db.list(resourcePath).valueChanges()
      .pipe(take(1))
      .toPromise();
    console.log({resources})
    const maxTransactions = resources.length;

    console.log("cost: ", cost)

    while (spend < cost && transactions <= maxTransactions) {
      spend += resources[0];
      resources.shift();
      console.log("after shift: ", resources, 'spend: ', spend, 'cost: ', cost)
      transactions++;
    }

    if (cost > spend) {
      alert('TRANSACTION DECLINED')
    } else {
      const change = spend - cost;

      if (change > 0) {
        resources.push(change);
      }

      this.db.object(resourcePath).set(resources);

      console.log('SPENT: ', spend, 'CHANGE: ', change, 'RESOURCES: ', resources)
    }
  }
}