import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-hands',
  templateUrl: './player-hands.component.html',
  styleUrls: ['./player-hands.component.scss'],
  host: {
    '[class.player-hands]': 'true'
  }
})
export class PlayerHandsComponent {
  private _hand = [];
  private _score: number = 0;

  @Input() players;
  @Input() focus;

  get hand() { return this._hand }
  set hand(value) {
    this._hand = value;
  }

  public add(card) {
    this._hand.push(card);
    console.log("add card: ", card, this.hand);
  }

  public remove(id) {
    console.log('remove card: ', id)
  }
}