import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

export type CardSide = 'front' | 'back';

@Component({
  selector: 'card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
  host: {
    '[class.card]': 'true',
    '[class.animate]': 'animate',
    '[class.mark]': 'mark !== null && mark !== undefined',
    '[attr.data-mark]': 'mark !== playerId ? mark : undefined'
  }
})
export class CardComponent implements OnInit {
  private _side: CardSide;

  animate = false;

  @Output() sideChange: EventEmitter<CardSide> = new EventEmitter<CardSide>();

  @Input() mark = null
  @Input() xray = false;
  @Input() playerId;
  @Input() 
  set side(val) {
    if (this._side && this.animate === false && val !== this._side) {
      this.animate = true;
    }
    this._side = val;
    if (this.animate) {
      this.sideChange.emit(val);
    }
  }
  get side() { return this._side }
  @Input() width: number = 50;
  @Input() height: number = 100;

  constructor() {}

  ngOnInit() {
    this.side = this.side ?? 'front';
  }
}
