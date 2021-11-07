import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { find } from 'lodash';
import * as fa from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  host: {
    '[class.app-button-group]': 'true'
  }
})
export class ButtonGroupComponent implements OnInit {
  currentButton;
  fa = fa;

  @Output() select = new EventEmitter<any>()
  
  @Input() buttons: {
    id: string,
    label: string,
    icon: string,
  }[]

  private _selectById: string
  @Input()
  get selectById() { return this._selectById }
  set selectById(value) {
    this._selectById = value;
    this.setButton();
  }
  @Input() unselectedClass: string = 'button-unselected'
  @Input() selectedClass: string = 'button-selected';

  ngOnInit() {
    console.log('buttons init: ', this.buttons, this.selectById)
    this.setButton();
  }
  
  reset() {
    this.setButton();
  }

  setButton() {
    console.log("select by id: ", this.selectById, this.buttons)
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