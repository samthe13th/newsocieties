import { Component } from '@angular/core';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss'],
  host: {
    '[class.scorecard]': 'true'
  }
})
export class ScorecardComponent {

}