import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toArray, range, each, find } from 'lodash';

@Component({
  selector: 'app-society-grid',
  templateUrl: './society-grid.component.html',
  styleUrls: ['./society-grid.component.scss'],
  host: {
    '[class.society-grid]': 'true',
  }
})
export class SocietyGridComponent {
  private showKey: string;
  grid = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"].map((code) => ({ code }))

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.list('shows', ref => ref.limitToLast(1))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(([snapshot]) => {
        this.showKey = snapshot.key
        this.initListeners(snapshot.payload.val())
      })
  }

  initListeners(show) {
    if (show?.divisions) {
      const listeners = {
        C: this.db.object(`shows/${this.showKey}/global`).valueChanges(),
        ...Object.keys(show.divisions).reduce((acc, code) => (
          { ...acc, [code]: this.db.object(`shows/${this.showKey}/divisions/${code}`).valueChanges() }
        ), {}),
      }

      this.grid = this.grid.map((slot) => {
        return listeners[slot.code] ? { ...slot, listener: listeners[slot.code] } : slot;
      });

      console.log('grid: ', this.grid)
    }
  }
}