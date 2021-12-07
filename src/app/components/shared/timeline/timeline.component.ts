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

  ngOnInit() {
    this.$timeline = combineLatest(
      this.db.object(`shows/${this.showKey}/startTime`).valueChanges(),
      this.db.list('timeline').valueChanges()
    ).pipe(
      map(([startTime, timeline]) => timeline.map((entry: any) => ({ ...entry, timestamp: moment(startTime).add(entry.time, 'minutes').format('h:mm:ss') }))),
      tap((timeline) => console.log({timeline}))
    )
  }
}
