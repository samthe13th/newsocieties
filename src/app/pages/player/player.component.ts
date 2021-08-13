import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  cards = [
    { side: 'back', value: 0 },
    { side: 'back', value: 2 },
    { side: 'back', value: 1 },
    { side: 'back', value: 2 },
    { side: 'back', value: 1 },
    { side: 'back', value: 1 },
    { side: 'back', value: 3 },
    { side: 'back', value: 0 },
    { side: 'back', value: 2 },
    { side: 'back', value: 1 },
    { side: 'back', value: 3 },
    { side: 'back', value: 1 },
    { side: 'back', value: 0 },
    { side: 'back', value: 3 },
    { side: 'back', value: 2 }
  ];

  constructor(firestore: AngularFirestore) {
    this.cards = shuffle(this.cards);
  }

  flip(i) {
    const card = this.cards[i];
    console.log(card)
    if (card.side === 'back' && card.value !== -1) {
      this.cards[i].side = 'front';
    }
  }

  afterFlip(i) {
    console.log('flipped: ', i, this.cards[i]);
    if (this.cards[i].value === 0) {
      const prev = i - 1;
      const next = i + 1;
      console.log('disable... ', prev, this.cards[prev]);
      setTimeout(() => {
        if (this.cards[prev] && this.cards[prev]) {
          this.cards[prev].value = -1;
        }
        if (this.cards[next]) {
          this.cards[next].value = -1;
        }
      })
    }
  }
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
