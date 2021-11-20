import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { find } from 'lodash';
import { AngularFireDatabase } from '@angular/fire/database';

export interface PlayerTurn  {
  player: string,
  id: string,
  actions: number, 
}

@Component({
  selector: 'app-player-turn',
  templateUrl: './player-turn.component.html',
  styleUrls: ['./player-turn.component.scss'],
  host: {
    '[class.app-player-turn]': 'true'
  }
})
export class PlayerTurnComponent implements OnInit {
  $turn: Observable<any>;

  @Output() turnChange = new EventEmitter<PlayerTurn>();

  @Input() divisionPath: string;
  @Input() showLabel = true;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.$turn = combineLatest(
      this.db.object(`${this.divisionPath}/turn`).valueChanges(),
      this.db.object(`${this.divisionPath}/citizens`).valueChanges()
    ).pipe(
      map(([turn, citizens]: any) => (
        find(citizens, ['id', turn])
      )),
      tap((turn) => {
        this.turnChange.emit(turn)
      })
    )
  }
}