import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-harvest-image',
  templateUrl: './harvest-image.component.html',
  styleUrls: ['./harvest-image.component.scss'],
  host: {
    '[class.resource]': 'type === "R"',
    '[class.one]': 'value === 1',
    '[class.two]': 'value === 2',
    '[class.three]': 'value === 3',
    '[class.contaminated]': 'contaminated',
    '[class.contaminant]': 'type === "C"',
    '[attr.data-division]': 'division'
  }
})
export class HarvestImageComponent {
  @Input() type: 'C' | 'R';
  @Input() value: number;
  @Input() contaminated: boolean;
  @Input() division;
}