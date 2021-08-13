import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PlayerDeckComponent } from 'src/app/components/player-deck/player-deck.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  id = 1;
  division = 'N';

  @ViewChild(PlayerDeckComponent) playerDeck: PlayerDeckComponent;

  constructor(firestore: AngularFirestore) {
  }

  onGather(card) {
    console.log("ON GATHER: ", card)
    this.playerDeck.add(card);
  }
}
