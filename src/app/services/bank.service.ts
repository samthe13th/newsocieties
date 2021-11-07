
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toNumber, map, range } from 'lodash';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
    ) {
  }

  calculateWealth(resources) {
    if (!resources) return 0;
    return resources.reduce((acc, R) => acc + R.value, 0);
  }

  async removeFromReserve(divisionPath, amount) {
    const reservePath = `${divisionPath}/reserve`;
    const reserve = await this.db.object(reservePath).valueChanges()
      .pipe(take(1))
      .toPromise();

    const difference = Math.max(0, toNumber(reserve) - amount)

    console.log('remove from reserve: ', reserve, amount);

    return new Promise((resolve) => {
      this.db.object(reservePath).set(difference).then(() => resolve(true));
    })
  }

  async addToReserve(divisionPath, amount) {
    const reservePath = `${divisionPath}/reserve`;
    const reserve = await this.db.object(reservePath).valueChanges()
      .pipe(take(1))
      .toPromise();

    console.log('add to reserve');
    return new Promise((resolve) => {
      this.db.object(reservePath).set(toNumber(reserve) + amount).then(() => resolve(true));
    })
  }

  $resources(showKey, divisionKey, id) {
    console.log('get resources:', `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`)
    return this.db.list(`shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`).valueChanges();
  }

  async depositResource(showKey, divisionKey, id, newResource): Promise<boolean> {
    const path = `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`;

    return new Promise((resolve) => {
      this.db.list(path).push(newResource).then(() => {
        resolve(true)
      })
    })
  }

  async depositResources(showKey, divisionKey, id, newResources): Promise<boolean> {
    const path = `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`;
    console.log('deposit: ', path)
    const resources: any[] = await this.db.list(path).valueChanges()
      .pipe(take(1))
      .toPromise();

    console.log("deposit: ", divisionKey, id, newResources)

    return new Promise((resolve) => {
      this.db.object(path).set([
        ...resources,
        ...newResources
      ]).then(() => {
        resolve(true)
      })
    })
  }

  quickConvert(division, amount) {
    const change = amount % 3;
    const resources = map(
      range(Math.floor(amount / 3)), () => ({ value: 3, division })
    )

    return (change > 0)
      ? [ ...resources, { value: change, division } ]
      : resources;
  }

  async spendResources(showKey, divisionKey, id, cost): Promise<boolean> {
    console.log("SPEND: ", showKey, divisionKey, id, cost)
    let spend = 0;
    let transactions = 0;
    const resourcePath = `shows/${showKey}/divisions/${divisionKey}/citizens/${id}/resources`
    const resources: any[] = await this.db.list(resourcePath)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    console.log({resources})
    const maxTransactions = resources.length;

    while (spend < cost && transactions <= maxTransactions) {
      spend += resources[0]?.value;
      resources.shift();
      transactions++;
    }

    return new Promise((resolve, reject) => {
      if (cost > spend) {
        alert('TRANSACTION DECLINED')
        reject(false)
      } else {
        const change = spend - cost;
  
        if (change > 0) {
          resources.push({ division: divisionKey, value: change });
        }
  
        this.db.object(resourcePath).set(resources).then(() => {
          resolve(true)
        })
      }
    })
  }
}