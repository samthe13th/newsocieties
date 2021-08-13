import { Component } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss'],
  host: {
    '[class.vote]': 'true'
  }
})
export class VoteComponent {

}