import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-large-popup',
  templateUrl: 'large-popup.component.html',
  styleUrls: ['large-popup.component.scss'],
  host: {
    '[class.app-large-popup]': 'true',
    '[class.animate-in]': 'animateIn',
    '[class.animate-out]': 'animateOut'
  },
})
export class LargePopupComponent implements OnInit {
  animateIn = false;
  animateOut = false;

  @Output() afterDismiss: EventEmitter<any> = new EventEmitter();

  private _data;
  @Input()
  get data() { return this._data }
  set data(value) { 
    console.log("LARGE POPUP DATA: ", value)
    this._data = value;
    this.reset();
  }
  @Input() canDismiss = true;

  constructor() {}

  ngOnInit() {
  }

  reset() {
    this.animateIn = false;
    setTimeout(() => {
      this.show();
    })
  }

  show() {
    this.animateIn = true;
  }

  dismiss() {
    this.animateOut = true;
    setTimeout(() => {
      this.afterDismiss.emit()
    }, 400)
  }
}
