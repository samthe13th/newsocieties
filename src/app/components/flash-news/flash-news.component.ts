import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Component({
  selector: 'app-flash-news',
  templateUrl: './flash-news.component.html',
  styleUrls: ['./flash-news.component.scss'],
  host: {
    '[class.app-flash-news]': 'true'
  }
})
export class FlashNewsComponent {
  $flashNews: Observable<any>;

  @Output() bannerChange = new EventEmitter<any>();

  @Input() showKey;
  @Input() divisionKey;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.$flashNews = this.db.list(
      `shows/${this.showKey}/divisions/${this.divisionKey}/events`,
      ref => ref.limitToLast(1)
    ).valueChanges()
    .pipe(
      tap((x) => console.log('tap: ', x)),
      map(([last]) => last)
    )
  }
}