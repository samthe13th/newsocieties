import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    const { show, division, date, showNumber } = this.route.snapshot.params;
    this.showKey = show;
    this.divisionKey = division;
    this.date = date;
    this.showNumber = showNumber;
  }
}