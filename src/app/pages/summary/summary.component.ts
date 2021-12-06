import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  host: {
    '[class.app-summary]': 'true',
  }
})
export class SummaryComponent implements OnInit {
  showKey: string;

  constructor(private route: ActivatedRoute) {
  }
  
  ngOnInit() {
    const { show } = this.route.snapshot.params;
    this.showKey = show;
    console.log("SOCIETY SUMMARY: ", this.showKey);
  }
}