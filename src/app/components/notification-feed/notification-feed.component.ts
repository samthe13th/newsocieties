import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { DivisionService } from 'src/app/services/division-service.service';
import { BankService } from 'src/app/services/bank.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { NotificationType } from 'src/app/shared/types';

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
  showResolved = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private db: AngularFireDatabase,
    private divisionService: DivisionService,
    private bankService: BankService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.$notifications = this.db.list(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications`
    ).snapshotChanges().pipe(
      map((notifications) => (
        notifications.map((n: any) => ({
          key: n.key,
          ...n.payload.val()
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
    this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications/${key}`
    ).update({ resolved: true })
  }

  markAsAccepted(key) {
    this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications/${key}`
    ).update({ resolved: true, accepted: true })
  }

  markAsRejected(key) {
    this.db.object(
      `shows/${this.showKey}/divisions/${this.divisionKey}/notifications/${key}`
    ).update({ resolved: true, rejected: true })
  }

  async rejectRequest(notification) {
    console.log('REJECT: ', notification);
    let notificationHeader;
    if (notification.type === NotificationType.glaRequest) {
      notificationHeader = `The ${this.divisionKey} Division rejected your land request(s).`;
      await this.notificationService.rejectGLA(this.showKey, notification.data);
    } else if (notification.type === NotificationType.resourceGift) {
      notificationHeader = `The ${this.divisionKey} Division rejected your gift of resources.`;
      await this.notificationService.rejectResources(this.showKey, notification.sender, notification.data)
    }
    console.log("REJECT: ", notification)
    await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/notifications`).push({
      type: NotificationType.message,
      header: notificationHeader,
      sender: this.divisionKey,
      reciever: notification.sender,
      resolved: false
    });
    await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/unseenNotifications`).push(this.divisionKey);
    this.markAsRejected(notification.key);
  }

  async acceptRequest(notification) {
    let notificationHeader;
    if (notification.type === NotificationType.glaRequest) {
      notificationHeader = `The ${this.divisionKey} Division accepted your land request(s).`
      await this.notificationService.acceptGLA(this.showKey, this.divisionKey, notification.data);
    } else if (notification.type === NotificationType.resourceGift) {
      notificationHeader = `The ${this.divisionKey} Division accepted your gift of resources.`
      await this.notificationService.acceptResources(this.showKey, this.divisionKey, notification.data);
    }
    await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/notifications`).push({
      type: NotificationType.message,
      header: notificationHeader,
      sender: this.divisionKey,
      reciever: notification.sender,
      resolved: false
    });
    await this.db.list(`shows/${this.showKey}/divisions/${notification.sender}/unseenNotifications`).push(this.divisionKey);
    this.markAsAccepted(notification.key);
  }

  rejectWithMessage() {
    console.log("reject with message")
  }

  scrollToBottom() {
    console.log("scroll to bottom: ", this.feedWrapper, this.feedWrapper.nativeElement)
    this.feedWrapper.nativeElement.scrollTop = this.feedWrapper.nativeElement.scrollHeight;
  }
}