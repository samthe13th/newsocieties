import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DivisionService } from 'src/app/services/division-service.service';

@Component({
  selector: 'app-archived-review',
  templateUrl: './archived-review.component.html',
  styleUrls: ['./archived-review.component.scss'],
  host: {
    '[class.app-archived-review]': 'true',
  }
})
export class ArchivedReviewComponent implements OnInit {
  showKey: string;
  divisionKey: string;
  date: string;
  showNumber: string;

  $divisionReview: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private divisionService: DivisionService
    ) {
  }
  
  ngOnInit() {
    const { show, division, date, showNumber } = this.route.snapshot.params;
    this.showKey = show;
    this.divisionKey = division;
    this.date = date;
    this.showNumber = showNumber

    console.log("REVIEW DATA: ", this.showKey, this.divisionKey, this.date, this.showNumber)

    this.$divisionReview = this.db.object(`shows/${this.showKey}/archive/${this.date}/${this.showNumber}/${this.divisionKey}`).valueChanges();
  }
}