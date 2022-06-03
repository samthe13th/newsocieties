import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-society-summary',
  templateUrl: './society-summary.component.html',
  styleUrls: ['./society-summary.component.scss'],
  host: {
    '[class.app-society-summary]': 'true',
    '[class.large-text]': 'details === "endgame"',
    '[class.flex-column]': 'true',
    '[class.large]': 'large',
    '[style.background]': 'division?.color'
  }
})
export class SocietySummaryComponent {
  @Input() division;
  @Input() showKey;
  @Input() details: 'full' | 'brief' | 'endgame';
  @Input() isAdmin = false;
  @Input() large = false;
  @Input() graph = true;

  showModal = false;

  calculateReserve(reserve) {
    return reserve ? reserve.reduce((acc, R) => acc + R, 0) : undefined
  }
}