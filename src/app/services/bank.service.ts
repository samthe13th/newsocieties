
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class BankService {
  constructor(private db: AngularFireDatabase) {

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