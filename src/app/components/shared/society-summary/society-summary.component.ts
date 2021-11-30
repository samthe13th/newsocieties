import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-society-summary',
  templateUrl: './society-summary.component.html',
  styleUrls: ['./society-summary.component.scss'],
  host: {
    '[class.society-summary]': 'true',
    '[class.flex-column]': 'true',
    '[style.background]': 'division?.color'
  }
})
export class SocietySummaryComponent {
  @Input() division;
  @Input() showKey;
  @Input() details: 'full' | 'brief';

  calculateReserve(reserve) {
    return reserve ? reserve.reduce((acc, R) => acc + R, 0) : undefined
  }
}