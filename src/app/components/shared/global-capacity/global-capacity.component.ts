import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { groupBy, each, zip, toArray, compact } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-global-capacity',
  template: `
  <div *ngIf="$globalCapacity | async as glc">
    <h1>Global Capacity</h1>
    <div class="glc-summary--lg">{{ glc.actual }} / {{ glc.capacity }}</div>
    <ng-container *ngIf="showExceeding">
      Exceeding Capacity
      <div class="glc-summary--sm">{{ glc.exceeding }}</div>
    </ng-container>
  </div>
  `,
  styleUrls: ['./global-capacity.component.scss'],
  host: {
    '[class.app-global-capacity]': 'true'
  }
})
export class GlobalCapacityComponent implements OnInit {
  $globalCapacity: Observable<any>;

  @Input() showKey: string;
  @Input() showExceeding = true;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$globalCapacity = combineLatest(
      ['N', 'S', 'W', 'E', 'NE', 'NW', 'SE', 'SW'].map((code) => (
        this.db.list(`shows/${this.showKey}/divisions/${code}/chartData`).valueChanges()
      ))
    ).pipe(
      map((data: any[][]) => {
        // zip will regroup the data by data by season rather than by division
        return zip(...data);
      }),
      map((groupedData) => {
        const global = { actual: 0, capacity: 0, exceeding: '0%' };

        let lastSeasonActual = 0;
        let lastSeasonCapacity = 0;

        each(groupedData, (season) => {
          let seasonActual = 0;
          let seasonCapacity = lastSeasonCapacity - lastSeasonActual;

          compact(season).forEach(([_season, _capacity, _actual]) => {
            seasonActual += _actual;
            seasonCapacity += _capacity;
          })

          global.actual += seasonActual;
          global.capacity += seasonCapacity;

          lastSeasonActual = seasonActual;
          lastSeasonCapacity = seasonCapacity;
        })

        global.exceeding = `${Math.round(((global.actual / global.capacity) ?? 0) * 100) - 100}%`;
        return global
      }),
    )
  }
}