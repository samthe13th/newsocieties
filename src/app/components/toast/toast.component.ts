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
  @Input() duration: number = 1800;

  constructor() {}

  ngOnInit() {
    console.log('init toast')
  }

  reset() {
    this.animateIn = false;
    this.animateOut = false;
    setTimeout(() => {
      this.show();
    })
  }

  show() {
    console.log("show toast", this.data);
    this.animateIn = true;
    setTimeout(() => {
      this.dismiss();
    }, this.data?.duration ?? this.duration)
  }

  dismiss() {
    this.animateOut = true;
    console.log('dismiss toast');
    setTimeout(() => {
      this.afterDismiss.emit()
    }, 400)
  }
}
