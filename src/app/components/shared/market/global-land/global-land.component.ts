import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';

const DIVISIONS = ["NW", "N", "NE", "W", "C", "E", "SW", "S", "SE"];

@Component({
  selector: 'app-global-land',
  templateUrl: './global-land.component.html',
  styleUrls: ['./global-land.component.scss'],
  host: {
    '[class.app-global-land]': 'true',
  }
})
export class GlobalLandComponent {
  divisions;

  constructor(private db: AngularFireDatabase) {}

  @Input() showKey;

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

      return DIVISIONS.map((code) => ({ code, listener: divisions[code] }))
    }
    return []
  }
}