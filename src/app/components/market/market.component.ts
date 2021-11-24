import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
  host: {
    '[class.app-market]': 'true',
  }
})
export class MarketComponent {
  $marketView: Observable<any>;
  landTilesPath;

  constructor(private db: AngularFireDatabase) {}

  @Input() showKey;
  @Input() divisionKey;
  @Input() showHeader = true;
  @Input() landCost;

  ngOnInit() {
    this.landTilesPath = `shows/${this.showKey}/divisions/${this.divisionKey}/landTiles`;
    this.$marketView = this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/marketView`).valueChanges();
  }
}