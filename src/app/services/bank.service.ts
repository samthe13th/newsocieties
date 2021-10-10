
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toNumber } from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
    ) {

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

  $resources(showKey, divisionKey, id) {
    console.log('get resources:', `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`)
    return this.db.list(`shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`).valueChanges();
  }

  async depositResources(showKey, divisionKey, id, newResources) {
    const path = `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`;
    console.log('deposit: ', path)
    const resources: any[] = await this.db.list(path).valueChanges()
      .pipe(take(1))
      .toPromise();

      console.log('resources: ', resources, newResources)

    this.db.object(path).set([
      ...resources,
      ...newResources
    ])
  }

  async spendResources(resourcePath, cost) {
    let spend = 0;
    let transactions = 0;
    const resources: any[] = await this.db.list(resourcePath).valueChanges()
      .pipe(take(1))
      .toPromise();
    const maxTransactions = resources.length;

    while (spend < cost && transactions <= maxTransactions) {
      spend += resources[0];
      resources.shift();
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
    }
  }
}