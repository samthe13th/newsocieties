import { Component, ViewChild, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LargePopupComponent } from '../large-popup/large-popup.component';
import { trigger, transition, animate, style } from '@angular/animations';
import { Howl, Howler } from 'howler';
import { LandCardTypes } from 'src/app/interfaces';

@Component({
  selector: 'app-division-popups',
  templateUrl: './division-popups.component.html',
  styleUrls: ['./division-popups.component.scss'],
  host: {
    '[class.app-division-popups]': 'true',
    '[class.dark-background]': 'type === "large-popup"',
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
  Sounds;

  @Input() type = 'toast';
  @Input() showKey;
  @Input() divisionKey;
  @Input() user = 'player';

  constructor(
    private db: AngularFireDatabase,
  ) {}

  ngOnInit() {
    this.Sounds = {
      contamination: new Howl({ src: 'assets/Contamination.mp3' }).volume(0.4),
      resource1: new Howl({ src: 'assets/gather1.mp3' }).volume(0.2),
      resource2: new Howl({ src: 'assets/gather2.mp3' }).volume(0.2),
      resource3: new Howl({ src: 'assets/gather3.mp3' }).volume(0.2),
    }
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
      ).subscribe((smallEvent: any) => {
        console.log("Small Event: ", smallEvent)
        if (smallEvent?.type === 'C' || smallEvent?.type === 'R') {
          this.playGatherSound(smallEvent?.type, smallEvent?.value)
        }
        this.divisionEvent = smallEvent;
      })
    }
  }

  playGatherSound(type, value) {
    console.log("play gather sound: ", type, value)
    if (type === LandCardTypes.C) {
      this.Sounds.contamination.play();
    } else if (value === 1) {
      this.Sounds.resource1.play();
    } else if (value === 2) {
      this.Sounds.resource2.play();
    } else if (value === 3) {
      this.Sounds.resource3.play();
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
