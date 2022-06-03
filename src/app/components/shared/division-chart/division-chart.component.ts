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
  $textData;

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

  rawData;
  chartDataPath;
  showModal = false;

  @Input() divisionKey;
  @Input() showKey;
  @Input() width = 300;
  @Input() height = 200;
  @Input() graph = true;
  
  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.chartDataPath = `shows/${this.showKey}/divisions/${this.divisionKey}/chartData`;
    this.$chartData = this.db.list(this.chartDataPath)
      .valueChanges()
      .pipe(
        tap((n) => console.log({n})),
        filter((data) => !_.isEmpty(data))
      );

    this.$textData = this.db.list(this.chartDataPath)
      .valueChanges()
      .pipe(
        filter((data) => !_.isEmpty(data)),
        tap((data) => {
          this.rawData = data;
          console.log('raw: ', data)
        }),
        map((data) => data.map(([s, c, a]: [number, number, number]) => {
          const diff = a - c;
          return { s, c, a, diff: (diff >= 0) ? `+${Math.abs(diff)}` : `-${Math.abs(diff)}` };
        })),
      );
  }

  editActions(divisionKey) {
    this.showModal = true;
  }

  updateChartData() {
    this.db.object(this.chartDataPath).set(this.rawData);
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }
}