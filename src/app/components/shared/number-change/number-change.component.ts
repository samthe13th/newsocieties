import { ViewChild, Component, Input, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { toNumber  } from 'lodash';
import { NumberPickerComponent } from 'ng-number-picker';

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

  @ViewChild('picker') picker: NumberPickerComponent;

  @Output() afterUpdate = new EventEmitter<number>();

  @Input() writePath: string;
  @Input() readPath: string;
  @Input() updateButtonText = 'Update';
  @Input() value = 0;
  @Input() min = 0;
  @Input() transformFunction: (value) => any;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (event.key === 'Enter') {
      this.write();
    }
  }

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
        .pipe(takeUntil(this.destroy$))
        .subscribe((n: number) => {
          this.value = n;
        })
    }
  }

  write(picker = null) {
    this.value = this.picker?.value;
    setTimeout(() => {
      const value = this.transformFunction ? this.transformFunction(this.value) : this.value;
      console.log("push value: ", value)
      this.db.object(this.writePath).set(value).then(() => {
        this.afterUpdate.emit(value);
      })
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}