import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DivisionService } from 'src/app/services/division-service.service';
import * as _ from 'lodash'
import * as fa from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-division-advancements',
  templateUrl: './division-advancements.component.html',
  styleUrls: ['./division-advancements.component.scss'],
  host: {
    '[class.app-division-advancements]': 'true'
  }
})
export class DivisionAdvancmentsComponent {
  constructor(private divisionService: DivisionService) {}
  fa = fa;
  
  @Output() change = new EventEmitter();

  @Input() ipad = false;
  @Input() advancements;

  editCommunalAdvancement(key, type) {
    console.log('edit adv: ', type, key)
    this.change.emit({ key, type });
  }

  editGlobalAdvancement(key) {
    this.change.emit({ key, type: 'global' })
  }
}