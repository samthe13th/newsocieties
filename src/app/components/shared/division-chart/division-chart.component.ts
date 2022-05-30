import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, filter, tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-division-chart',
  templateUrl: './division-chart.component.html',
  styleUrls: ['./division-chart.component.scss'],
  host: {
    '[class.app-division-chart]': 'true',
  }
})
export class DivisionChartComponent implements OnInit {
  $chartData;
  $rawData;

  chart = {
    type: "LineChart",
    columns: [
      ['number', 'Season'],
      ['number', 'Capacity'],
      ['number', 'Actions'],
    ],
    options: {
      legend: 'none',
      lineWidth: [4, 8],
      chartArea: {
        left: 30,
        right: 20,
        bottom: 25,
        top: 10
      }
    }
  }

  @Input() divisionKey;
  @Input() showKey;
  @Input() width = 300;
  @Input() height = 200;
  @Input() graph = true;
  
  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$chartData = this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/chartData`)
      .valueChanges()
      .pipe(
        tap((n) => console.log({n})),
        filter((data) => !_.isEmpty(data))
      );

    this.$rawData = this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/chartData`)
      .valueChanges()
      .pipe(
        filter((data) => !_.isEmpty(data)),
        map((data) => data.map(([s, c, a]: [number, number, number]) => {
            const diff = a - c;
            return { s, c, a, diff: (diff >= 0) ? `+${Math.abs(diff)}` : `-${Math.abs(diff)}` };
          }))
      );
  }
}