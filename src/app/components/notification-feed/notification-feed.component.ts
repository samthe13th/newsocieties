import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-notification-feed',
  templateUrl: './notification-feed.component.html',
  styleUrls: ['./notification-feed.component.scss'],
  host: {
    '[class.app-notification-feed]': 'true'
  }
})
export class NotificationFeedComponent implements AfterViewInit {
  @ViewChild('feedWrapper') feedWrapper: ElementRef;

  @Input() showKey: string; 
  @Input() divisionKey: string;

  $notifications: Observable<any>;

  private subscriptions: Subscription[] = [];

  constructor(private db: AngularFireDatabase) {}

  showResolved = true;

  ngOnInit() {
    this.$notifications = this.db.list(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications`
    ).snapshotChanges().pipe(
      map((notifications) => (
        notifications.map((n: any) => ({
          key: n.key, ...n.payload.val()
        }))
      )
    ));

    this.subscriptions.push(this.$notifications.subscribe((n) => {
      console.log("sub: ", n);
      setTimeout(() => {
        this.scrollToBottom();
      })
    }))
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  markAsResolved(key) {
    console.log('mark as resolved: ', key);
    this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications/${key}`
    ).update({ resolved: true })
  }

  rejectRequest() {
    console.log('reject request')
  }

  rejectWithMessage() {
    console.log("reject with message")
  }

  scrollToBottom() {
    console.log("scroll to bottom: ", this.feedWrapper, this.feedWrapper.nativeElement)
    this.feedWrapper.nativeElement.scrollTop = this.feedWrapper.nativeElement.scrollHeight;
  }
}