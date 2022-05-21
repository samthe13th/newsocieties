import { Component, Input, OnChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';

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

  ipad = false;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
  ) {}

  ngOnChanges() {
    console.log('route: ', this.route.snapshot)
    this.ipad = this.route.snapshot.queryParams.ipad === 'true';
    console.log("Archive change", this.divisionKey, this.showKey, this.date, this.showNumber)
    this.$divisionReview = this.db.object(`shows/${this.showKey}/archive/${this.date}/${this.showNumber}/${this.divisionKey}`).valueChanges();
  } 
}