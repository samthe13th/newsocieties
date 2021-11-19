import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-division-popups',
  templateUrl: './division-popups.component.html',
  styleUrls: ['./division-popups.component.scss'],
  host: {
    '[class.app-division-popups]': 'true',
    '[class.hide]': '!divisionEvent'
  }
})
export class DivisionPopupsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  divisionEvent;

  @Input() showKey;
  @Input() divisionKey;

  constructor(
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    const popupUrl = `shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`;
    console.log('POPUP: ', {popupUrl})
    this.db.object(popupUrl)
      .valueChanges()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((popup) => {
        console.log('POPUP: ', popup)
        this.divisionEvent = popup;
      })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  afterToastHide() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).remove()
  }
}
