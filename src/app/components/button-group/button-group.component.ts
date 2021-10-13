import { Component, Input, EventEmitter, Output } from '@angular/core';
import { find } from 'lodash';

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

  @Input() selectById: string;
  @Input() unselectedClass: string = 'button-unselected'
  @Input() selectedClass: string = 'button-selected';

  ngOnInit() {
    this.setButton();
  }

  reset() {
    this.setButton();
  }

  setButton() {
    if (this.buttons) {
      this.currentButton = this.selectById
        ? find(this.buttons, ['id', this.selectById])
        : this.buttons[0];
    }
    console.log('set... ', this.buttons, this.selectById, this.currentButton)
  }

  selectButton(button) {
    this.currentButton = button; 
    this.select.emit(button)
  }
}