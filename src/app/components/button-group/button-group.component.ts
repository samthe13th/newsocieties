import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  host: {
    '[class.app-button-group]': 'true'
  }
})
export class ButtonGroupComponent {
  currentButton;

  @Output() select = new EventEmitter<any>()
  
  @Input() buttons: {
    id: string,
    label: string,
    icon: string,
  }[]

  @Input() unselectedClass: string = 'button-unselected'
  @Input() selectedClass: string = 'button-selected';

  ngOnInit() {
    if (this.buttons) {
      this.currentButton = this.buttons[0];
    }
  }

  selectButton(button) {
    this.currentButton = button; 
    this.select.emit(button)
  }
}