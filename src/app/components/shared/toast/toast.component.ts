import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-toast',
  templateUrl: 'toast.component.html',
  styleUrls: ['toast.component.scss'],
  host: {
    '[class.app-toast]': 'true',
    '[class.animate-in]': 'animateIn',
    '[class.animate-out]': 'animateOut',
  }
})
export class ToastComponent implements OnInit {
  animateIn = false;
  animateOut = false;

  @Output() afterDismiss: EventEmitter<any> = new EventEmitter();

  private _data;
  @Input()
  get data() { return this._data }
  set data(value) { 
    this._data = value;
    this.reset();
  }
  @Input() duration: number = 3000;

  constructor() {}

  ngOnInit() {
  }

  reset() {
    this.animateIn = false;
    this.animateOut = false;
    setTimeout(() => {
      this.show();
    })
  }

  show() {
    this.animateIn = true;
    setTimeout(() => {
      this.dismiss();
    }, this.duration)
  }

  dismiss() {
    this.animateOut = true;
    setTimeout(() => {
      this.afterDismiss.emit()
    }, 400)
  }
}
