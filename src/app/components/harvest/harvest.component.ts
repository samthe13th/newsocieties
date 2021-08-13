import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { range, map, filter } from 'lodash'

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
  styleUrls: ['./harvest.component.scss'],
  host: {
    '[class.harvest]': 'true'
  }
})
export class HarvestComponent implements OnInit {
  cards = [];

  constructor(firestore: AngularFirestore) {
    console.log('harvest')
    this.cards = shuffle(this.cards);
  }

  ngOnInit() {
    this.cards = this.generateHarvest({});
    console.log(this.cards);
  }

  generateHarvest(config){
    return range(7).map(
      () => range(7).map(() => (
        { value: getRandomInt(0, 3), owner: null, side: 'back' }
      )
    ))
  }


  flip(row, i) {
    const card = this.cards[row][i];
    console.log(card)
    if (card.side === 'back' && card.value !== -1) {
      this.cards[row][i].side = 'front';
    }
  }

  afterFlip(row, i) {
    // A card value of 0 signifies a contaminant
    if (this.cards[row][i].value === 0) {
      const left = this.cards[row]?.[i - 1];
      const right = this.cards[row]?.[i + 1];
      const top = this.cards[row - 1]?.[i];
      const bottom = this.cards[row + 1]?.[i];

      setTimeout(() => {
        if (left) {
          // A card value of -1 signifies removal of the card from the board due to contamination
          left.value = -1;
        }
        if (right) {
          right.value = -1;
        }
        if (top) {
          top.value = -1;
        }
        if (bottom) {
          bottom.value = -1;
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const int = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(int)
  return int
}
