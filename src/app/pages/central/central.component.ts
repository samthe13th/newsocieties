import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toArray, range } from 'lodash';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE } from './templates';

const DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW']
const MAX_HARVEST = 49;

@Component({
  selector: 'app-central',
  templateUrl: './central.component.html',
  styleUrls: ['./central.component.scss']
})
export class CentralComponent implements OnInit {
  showKey: string;
  divisionChanges;

  constructor(private db: AngularFireDatabase) {
    console.log('DB: ', db);
  }

  ngOnInit() {
    this.db.list('shows', ref => ref.limitToLast(1))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(([snapshot]) => {
        this.showKey = snapshot.key
        this.createDivisionListeners(snapshot.payload.val())
      })
  }

  createDivisionListeners(show) {
    if (show?.divisions) {
      this.divisionChanges = toArray(show.divisions).map(division => {
        return this.db.object(`shows/${this.showKey}/divisions/${division.code}`).valueChanges();
      })
    }
  }

  newShow() {
    const divisions = this.generateDivisions();
    this.db.list('shows').push({ divisions, ...SHOW_TEMPLATE })
      .then((res) => { this.buildShow(res.key) })
  }

  buildShow(key) {
    this.db.object(`shows/${key}`).valueChanges()
      .pipe(take(1))
      .subscribe((show) => {
        this.showKey = key;
        this.createDivisionListeners(show);
      })
  }

  generateDivisions() {
    return DIVISIONS.reduce((acc, abv) => {
      return { ...acc, [abv]: { 
        code: abv, 
        landTiles: this.generateLandTiles(),
        ...DIVISION_TEMPLATE
      } }
    }, {});
  }

  generateLandTiles() {
    const slots = range(MAX_HARVEST);
    return slots.map(() => ({ 
      value: -1, 
      owner: null, 
      harvested: false, 
      contaminated: false,
      mark: null
     }))
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}