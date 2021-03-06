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
  @Input() size: 'md' | 'lg' = 'md'
  @Input() look: 'default' | 'round' = 'default';

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
    console.log('init button group. LOOK: ', this.look)
    this.setButton();
  }
  
  reset() {
    this.setButton();
  }

  setButton() {
    console.log("SELECT BY ID: ", this.selectById, this.buttons)
    if (this.buttons) {
      this.currentButton = this.selectById
        ? find(this.buttons, ['id', this.selectById])
        : this.buttons[0];
    }
  }

  selectButton(button) {
    this.currentButton = button; 
    this.select.emit(button)
  }
}