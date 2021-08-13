import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss'],
  host: {
    '[class.announcement]': 'true'
  }
})
export class AnnouncementComponent {

}