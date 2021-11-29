import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss'],
  host: {
    '[class.app-state]': 'true',
    '[@simpleFadeAnimation]': 'fadeState',
    '(@simpleFadeAnimation.done)': 'onDone($event)',
  },
  animations: [
    trigger('simpleFadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition('* => *', animate('1000ms ease')),
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
    ])
  ]
})
export class StateComponent implements OnInit {
  fadeState = 'out'

  private _templateName;
  public template: TemplateRef<any>;

  @Input() templates: any;
  @Input() 
  get templateName() { return this._templateName }
  set templateName(name) {
    if (name !== this._templateName) {
      console.log('change: ', name);
      this.fadeState = 'out'
    }
    this._templateName = name;

    console.log('template: ', this.templates[this.templateName])
    // console.log("set.... ", name, this.templates, this.templates[name])
  }

  ngOnInit() {
    //this.fadeState = 'in';
    this.template = this.templates[this.templateName];
    console.log('init: ', this.templates, this.templateName, this.templates[this.templateName])
  }

  onDone(event) {
    console.log('on done: ', this.templateName);
    if (this.templates[this.templateName]) {
      this.template = this.templates[this.templateName];
      this.fadeState = 'in';
    }
  }
}