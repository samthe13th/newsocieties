import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { map, tap, take } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { groupBy, each, zip, toArray, compact, toNumber } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-global-capacity',
  templateUrl: './global-capacity.component.html',
  styleUrls: ['./global-capacity.component.scss'],
  host: {
    '[class.app-global-capacity]': 'true'
  }
})
export class GlobalCapacityComponent implements OnInit {
  $globalCapacity: Observable<any>;
  $centralAdjustment: Observable<any>;

  centralAdjustment = 0;
  dirtyMagicInput = 0;
  actionSheet;

  @ViewChild('dirtyMagicSheet') dirtyMagicSheet: TemplateRef<any>;

  @Input() showKey: string;
  @Input() showExceeding = true;
  @Input() isAdmin = false;

  constructor(
    private db: AngularFireDatabase,
    private bottomSheet: MatBottomSheet,
    ) {}

  ngOnInit() {
    this.$centralAdjustment = this.db.object(`shows/${this.showKey}/centralAdjustment`).valueChanges().pipe(
      tap((x) => {
        this.centralAdjustment = toNumber(x)
      })
    )
    this.$globalCapacity = combineLatest(
      this.$centralAdjustment,
      ...['N', 'S', 'W', 'E', 'NE', 'NW', 'SE', 'SW'].map((code) => (
        this.db.list(`shows/${this.showKey}/divisions/${code}/chartData`).valueChanges()
      )),
    ).pipe(
      map(([centralAdjustment, ...data]) => {
        console.log({centralAdjustment, data})
        // zip will regroup the data by data by season rather than by division
        return { grouped: zip(...data), centralAdjustment };
      }),
      map(({ grouped, centralAdjustment }) => {
        const global = { actual: <number>centralAdjustment ?? 0, capacity: 0, exceeding: '0%' };

        let lastSeasonActual = 0;
        let lastSeasonCapacity = 0;

        each(grouped, (season) => {
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

        global.exceeding = `${Math.round((((global.actual + <number>centralAdjustment) / global.capacity) ?? 0) * 100) - 100}%`;
        
        return global
      }),
    )
  }

  dirtyMagic() {
    this.dirtyMagicInput = this.centralAdjustment;
    this.actionSheet = this.bottomSheet.open(this.dirtyMagicSheet);
  }

  dismissSheet() {
    this.actionSheet.dismiss();
    this.actionSheet = undefined;
  }

  async modifyGlobalCapacity() {
    await this.db.object(`shows/${this.showKey}/centralAdjustment`).set(this.dirtyMagicInput);
    this.dismissSheet();
  }
}