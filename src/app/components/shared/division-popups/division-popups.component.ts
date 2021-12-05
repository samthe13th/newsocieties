import { Component, ViewChild, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LargePopupComponent } from '../large-popup/large-popup.component';
import { trigger, transition, animate, style } from '@angular/animations';


@Component({
  selector: 'app-division-popups',
  templateUrl: './division-popups.component.html',
  styleUrls: ['./division-popups.component.scss'],
  host: {
    '[class.app-division-popups]': 'true',
    '[class.hide]': '!divisionEvent',
  },
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ]
})
export class DivisionPopupsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  @ViewChild("largePopup") largePopup: LargePopupComponent;

  divisionEvent;

  @Input() type = 'toast';
  @Input() showKey;
  @Input() divisionKey;
  @Input() user = 'player';

  constructor(
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    const popupUrl = `shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`;

    if (this.type === 'large-popup') {
      console.log('listen to large popup events')
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`)
        .valueChanges()
        .pipe(
          takeUntil(this.destroy$),
        ).subscribe((largeEvent) => {
          this.divisionEvent = largeEvent;
        })
    } else {
      this.db.object(popupUrl)
      .valueChanges()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((smallEvent) => {
        this.divisionEvent = smallEvent;
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  afterToastHide() {
    setTimeout(() => {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).remove()
    }, 1000)
  }

  afterLargePopupHide() {
    setTimeout(() => {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`).remove()
    })
  }
}
