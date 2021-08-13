import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-deck',
  templateUrl: './player-deck.component.html',
  styleUrls: ['./player-deck.component.scss'],
  host: {
    '[class.player-deck]': 'true'
  }
})
export class PlayerDeckComponent {
  private _resources = [{ value: 1 }, { value: 3 }];
  private _achievements: {
    safety: [],
    health: [],
    arts: [],
    knowledge: [],
    infastructure: []
  }
  private wealth = 0;

  @Input() id;
  @Input() division;

  get resources() { return this._resources }
  set resources(value) {
    this._resources = value;
  }

  public add(R) {
    this._resources.push(R);
    this.wealth += R.value;
    console.log("add card: ", R, this.resources);
  }

  public remove(id) {
    console.log('remove resource: ', id)
  }
}