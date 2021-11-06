import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-users-grid',
  templateUrl: './users-grid.component.html',
  styleUrls: ['./users-grid.component.scss'],
  host: {
    '[class.app-users-grid]': 'true'
  }
})
export class UsersGridComponent {
  $users: Observable<any>;
  usersData;

  @Input() showKey;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    console.log('showKey: ', this.showKey)
    this.$users = this.db.list(`shows/${this.showKey}/users`).valueChanges();
  }

  uploadUsersData(e) {
    console.log('upload ', e)
  }
}