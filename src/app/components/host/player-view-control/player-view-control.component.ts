import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faBullseye, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-player-view-control',
  templateUrl: './player-view-control.component.html',
  styleUrls: ['./player-view-control.component.scss'],
  host: {
    '[class.app-player-view-control]': 'true',
    '[class.highlight]': 'highlight',
    '[class.show]': 'show',
    '[class.short]': 'short'
  }
})
export class PlayerViewControlComponent {
  showIcon = faEye;
  hideIcon = faEyeSlash;
  highlightIcon = faBullseye;

  @Output() highlightChange = new EventEmitter<boolean>();
  @Output() visibilityChange = new EventEmitter<boolean>();

  @Input() name;
  @Input() label;
  @Input() highlight = false;
  @Input() show = false;
  @Input() short = false;
  @Input() constant = false;

  toggleHighlight() {
    console.log('highlight');
    this.highlight = !this.highlight;
    this.highlightChange.emit(this.highlight);
  }

  toggleView() {
    this.show = !this.show;
    console.log('toggle view: ', this.show)
    this.visibilityChange.emit(this.show);
  }
}