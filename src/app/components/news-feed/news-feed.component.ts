import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { DivisionService } from 'src/app/services/division-service.service';


@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss'],
  host: {
    '[class.app-news-feed]': 'true'
  }
})
export class NewsFeedComponent {
  @ViewChild('feedWrapper') feedWrapper: ElementRef;

  @Input() showKey: string; 
  @Input() divisionKey: string;

  $events: Observable<any>;
  showResolved = false;

  constructor(
    private db: AngularFireDatabase,
    private divisionService: DivisionService,
  ) {}

  ngOnInit() {
    this.$events = this.db.list(
      `shows/${this.showKey}/divisions/${this.divisionKey}/events`
    ).snapshotChanges().pipe(
      map((notifications) => (
        notifications.map((n: any) => ({
          key: n.key,
          ...n.payload.val()
        })).reverse()
      ),
      tap((events) => console.log({events}))
    ));
  }

  showInBanner(event) {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/news`).set(event).then(() => {
      this.markAsResolved(event.key);
    })
  }

  markAsResolved(key) {
    this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/events/${key}`
    ).update({ resolved: true })
  }

  clearBannerEvent() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/news`).remove();
  }

  async acceptRequest(event) {
    console.log("accept ", event)
    // let notificationHeader;
    // if (notification.type === NotificationType.glaRequest) {
    //   notificationHeader = `The ${this.divisionKey} Division accepted your land request(s).`
    //   await this.notificationService.acceptGLA(this.showKey, this.divisionKey, notification.data);
    // } else if (notification.type === NotificationType.resourceGift) {
    //   notificationHeader = `The ${this.divisionKey} Division accepted your gift of resources.`
    //   await this.notificationService.acceptResources(this.showKey, this.divisionKey, notification.data);
    // }
    // await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/notifications`).push({
    //   type: NotificationType.message,
    //   header: notificationHeader,
    //   sender: this.divisionKey,
    //   reciever: notification.sender,
    //   resolved: false
    // });
    // await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/unseenNotifications`).push(this.divisionKey);
  }
}