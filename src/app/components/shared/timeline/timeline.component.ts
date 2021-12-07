import { Component, OnInit, Input } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import * as moment from 'moment';

@Component({
  selector: 'app-timeline',
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.component.scss'],
  host: {
    '[class.app-timeline]': 'true'
  }
})
export class TimelineComponent implements OnInit {
  $timeline: Observable<any>;

  @Input() showKey: string;
  @Input() timer;

  constructor(private db: AngularFireDatabase) {
  }

  insertPause(min) {
    this.db.list(`shows/${this.showKey}/timeline`).query.ref.transaction((_timeline) => {
      console.log("TIMELINE TRANSACTION ", min, _timeline)
      const timeline = _timeline;
      timeline.splice(min, 0, { paused: true, time: min, action: "PAUSE" })
      return timeline
    })
  }

  ngOnInit() {
    this.$timeline = combineLatest(
      this.db.object(`shows/${this.showKey}/startTime`).valueChanges(),
      this.db.list(`shows/${this.showKey}/timeline`).valueChanges()
    ).pipe(
      map(([startTime, timeline]) => timeline.map((entry: any, index) => ({ ...entry, timestamp: moment(startTime).add(index + 1, 'minutes').format('h:mm:ss') }))),
    )
  }
}
