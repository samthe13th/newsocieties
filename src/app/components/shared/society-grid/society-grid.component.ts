import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';

const DIVISIONS = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];

@Component({
  selector: 'app-society-grid',
  templateUrl: './society-grid.component.html',
  styleUrls: ['./society-grid.component.scss'],
  host: {
    '[class.society-grid]': 'true',
  }
})
export class SocietyGridComponent {
  divisions;
  Math = Math;

  constructor(private db: AngularFireDatabase) {}

  @Input() showKey;
  @Input() details = 'full';
  @Input() isAdmin = false;
  @Input() large = false;

  ngOnInit() {
    this.db.object(`shows/${this.showKey}`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((show) => {
        this.divisions = this.getDivisionObservables(show);
      })
  }

  getDivisionObservables(show) {
    if (show?.divisions) {
      const divisions = Object.keys(show.divisions).reduce((acc, code) => ({ 
        ...acc,
        [code]: this.db.object(`shows/${this.showKey}/divisions/${code}`).valueChanges()
      }), {});

      const listeners = {
        C: this.db.object(`shows/${this.showKey}/global`).valueChanges(),
        ...divisions,
      }

      console.log({listeners})

      return DIVISIONS.map((code) => listeners[code]
        ? { code, listener: listeners[code] }
        : { code }
      );
    }
    return []
  }
}