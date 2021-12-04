import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { toNumber  } from 'lodash';

@Component({
  selector: 'app-number-change',
  templateUrl: './number-change.component.html',
  styleUrls: ['./number-change.component.scss'],
  host: {
    '[class.app-number-change]': 'true'
  }
})
export class NumberChangeComponent implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  @Output() afterUpdate = new EventEmitter<number>();

  @Input() writePath: string;
  @Input() readPath: string;
  @Input() updateButtonText = 'Update';
  @Input() value = 0;
  @Input() min;

  private _max;
  @Input() 
  get max() { return this._max }
  set max(value) {
    this._max = toNumber(value) ?? 0;
    this.value = Math.min(this._max, this.value);
  }

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    if (this.readPath) {
      this.db.object(this.readPath)
        .valueChanges()
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe((n: number) => {
          this.value = n;
        })
    }
  }

  onValueChange(value) {
    this.value = value;
  }

  write() {
    this.db.object(this.writePath).set(this.value).then(() => {
      this.afterUpdate.emit(this.value);
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}