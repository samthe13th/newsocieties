import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  host: {
    '[class.app-chat]': 'true'
  }
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('feedWrapper') feedWrapper: ElementRef;

  @Input() showKey: string; 
  @Input() feedName: string;
  @Input() sender: string;

  $feed: Observable<any>;

  private subscriptions: Subscription[] = [];

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$feed = this.db.list(
      `shows/${this.showKey}/feeds/${this.feedName}`
    ).valueChanges();

    this.subscriptions.push(this.$feed.subscribe((n) => {
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

  scrollToBottom() {
    console.log("scroll to bottom: ", this.feedWrapper, this.feedWrapper.nativeElement)
    this.feedWrapper.nativeElement.scrollTop = this.feedWrapper.nativeElement.scrollHeight;
  }
}