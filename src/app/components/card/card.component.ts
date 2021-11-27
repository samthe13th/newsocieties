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

  @Output() sideChange: EventEmitter<CardSide> = new EventEmitter<CardSide>();

  @Input() mark = null
  @Input() xray = false;
  @Input() playerId;
  @Input() contaminated = false;
  @Input() 
  set side(val) {
    this._side = val;
  }
  get side() { return this._side }
  @Input() width: number = 50;
  @Input() height: number = 100;
  @Input() animate = false;

  constructor() {}

  ngOnInit() {
    this.side = this.side ?? 'front';
  }
}
