import { Component, Input } from '@angular/core';
import { slice } from 'lodash';
import { Observable } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';

@Component({
  selector: 'app-player-deck',
  templateUrl: './player-deck.component.html',
  styleUrls: ['./player-deck.component.scss'],
  host: {
    '[class.player-deck]': 'true'
  }
})
export class PlayerDeckComponent {
  $GLAResources: Observable<any>;

  private _resources = [
    { value: 1 }, { value: 3 }, { value: 2 },
    { value: 1 }, { value: 3 }, { value: 2 },
    { value: 1 }, { value: 3 }, { value: 2 },
  ];
  private _achievements: {
    safety: [],
    health: [],
    arts: [],
    knowledge: [],
    infastructure: []
  }
  wealth = 0;

  @Input() id;
  @Input() division;

  ngOnInit() {
    // this.resources = sortBy(this.resources, 'value');
    this.calculateWealth()
  }

  get resources() { return this._resources }
  set resources(value) {
    this._resources = value;
  }

  public add(R) {
    if (R.value === LandCardValues.CONTAM) {
      this.contaminateResources()
    } else {
      this._resources.push(R);
      this.wealth += R.value;
      // this.resources = sortBy(this.resources, 'value')
    }
  }

  public remove(id) {
    console.log('remove resource: ', id)
  }

  public spend(cost) {
    if (cost > this.wealth) {
      window.alert("Sorry, you can't afford that :(")
    } else {
      const change = this.spendResources(cost)
    }
  }

  private spendResources(cost) {
    let spend = 0;
    let transactions = 0;
    const maxTransactions = this.resources.length;

    while (spend < cost && transactions <= maxTransactions) {
      spend += this.resources[0].value;
      this.resources.shift();
      transactions++;
    }

    if (cost > spend) {
      alert('TRANSACTION DECLINED')
    } else {
      const change = spend - cost;

      if (change > 0) {
        this.resources.push({ value: change });
      }
  
      this.calculateWealth();
  
      console.log('SPENT: ', spend, 'CHANGE: ', change)
    }
  }

  private calculateWealth() {
    this.wealth = this.resources.reduce((acc, R) => acc + R.value, 0);
  }

  private contaminateResources() {
    const toDestroy = Math.ceil(this.resources.length / 2);
    const destroyMsg = toDestroy > 0 
      ? ` ${formatPlural(toDestroy, 'resource has', 'resources have')} been destroyed`
      : ''

    this.resources = slice(this.resources, toDestroy)
    this.calculateWealth();

    window.alert(`You gathered a contaminant!${destroyMsg}`);
  }
}

function formatPlural(num, singular, plural) {
  return num == 1 ? `${num} ${singular}` : `${num} ${plural}`;
}