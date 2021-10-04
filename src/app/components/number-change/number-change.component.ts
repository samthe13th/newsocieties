import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { pipe } from 'rxjs'

@Component({
  selector: 'app-number-change',
  templateUrl: './number-change.component.html',
  styleUrls: ['./number-change.component.scss'],
  host: {
    '[class.app-number-change]': 'true'
  }
})
export class NumberChangeComponent {
  @Input() writePath: string;
  @Input() readPath: string;
  @Input() updateButton: {
    text: string,
    update: () => void,
  }
  @Input() value = 0;

  private _max;
  @Input() 
  get max() { return this._max }
  set max(value) {
    this._max = value ?? 0;
    console.log('set max: ', this._max)
  }

  @Input() min;

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    if (this.readPath) {
      this.db.object(this.readPath)
        .valueChanges()
        .pipe(take(1))
        .subscribe((n: number) => {
          this.value = n;
        })
    }
  }

  onValueChange(value) {
    this.value = value;
  }

  write() {
    console.log("write... ", this.writePath, this.value)
    this.db.object(this.writePath).set(this.value);
    this.value = 0;
  }
}