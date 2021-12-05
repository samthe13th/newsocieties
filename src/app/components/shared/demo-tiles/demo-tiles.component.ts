import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-tiles',
  templateUrl: './demo-tiles.component.html',
  styleUrls: ['./demo-tiles.component.scss'],
  host: {
    '[class.app-demo-tiles]': 'true'
  }
})
export class DemoTilesComponent {
  @Input() tiles = [
    [ 'O', 'X', 'O' ],
    [ 'X', 'C', 'X' ],
    [ 'O', 'X', 'O' ]
  ]
  @Input() centerTileValue = 1;
}