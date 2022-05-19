import { Component, Input, OnChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-archived-review-display',
  templateUrl: './archived-review-display.component.html',
  styleUrls: ['./archived-review-display.component.scss'],
  host: {
    '[class.app-archived-review-display]': 'true',
  }
})
export class ArchivedReviewDisplayComponent implements OnChanges {
  $divisionReview;

  @Input() divisionKey;
  @Input() showKey;
  @Input() date;
  @Input() showNumber;

  constructor(
    private db: AngularFireDatabase
  ) {}

  ngOnChanges() {
    console.log("Archive change", this.divisionKey, this.showKey, this.date, this.showNumber)
    this.$divisionReview = this.db.object(`shows/${this.showKey}/archive/${this.date}/${this.showNumber}/${this.divisionKey}`).valueChanges();
  } 
}