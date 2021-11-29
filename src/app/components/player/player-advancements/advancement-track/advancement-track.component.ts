import { Component, Input } from '@angular/core';
import { range } from 'lodash';

@Component({
  selector: 'app-adv-track',
  templateUrl: './advancement-track.component.html',
  styleUrls: ['./advancement-track.component.scss'],
  host: {
    '[class.app-adv-track]': 'true'
  }
})
export class AdvancementTrackComponent {
  slots = range(3);

  @Input() contributions: number;
  @Input() color: string;

  ngOnInit() {
    console.log("color: ", this.color)
  }
}