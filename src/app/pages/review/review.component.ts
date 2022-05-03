import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  host: {
    '[class.app-review]': 'true',
  }
})
export class ReviewComponent implements OnInit {
  showKey: string;
  divisionKey: string;

  constructor(private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    const { show, division } = this.route.snapshot.params;
    this.showKey = show;
    this.divisionKey = division;

    console.log("REVIEW: ", show, division);
  }
}