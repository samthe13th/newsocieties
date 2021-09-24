import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  host: {
    '[class.app-chat]': 'true'
  }
})
export class ChatComponent {
  $feed: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  @Input() showKey: string; 
  @Input() feedName: string;
  @Input() sender: string;

  ngOnInit() {
    console.log('sub to ', this.showKey)
    this.$feed = this.db.list(
      `shows/${this.showKey}/feeds/${this.feedName}`
    ).valueChanges();
    this.$feed.subscribe((n) => {
      console.log("sub: ", n)
    })
  }
}