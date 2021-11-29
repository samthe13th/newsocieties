import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reserve-bar',
  templateUrl: 'reserve-bar.component.html',
  styleUrls: ['reserve-bar.component.scss'],
  host: {
    '[class.app-reserve-bar]': 'true',
  }
})
export class ReserveBarComponent {
  @Input() thresholds: any[];
  @Input() percent: any;
  @Input() color: string;

  constructor() {}

  ngOnInit() {
    console.log('bar: ', this.thresholds, this.percent, this.color)
  }
}
