import { Component, Input, TemplateRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  host: {
    '[class.app-tabs]': 'true'
  }
})
export class TabsComponent {
  currentTab;
  @Output() tabChange = new EventEmitter<any>();
  
  @Input() tabs: {
    id: string,
    tabTemplate: TemplateRef<any>,
    bodyTemplate: TemplateRef<any>,
  }[]

  @Input() unselectedClass: string = 'tabs__default-unselected'
  @Input() selectedClass: string = 'tabs__default-selected';

  ngOnInit() {
    if (this.tabs) {
      this.currentTab = this.tabs[0];
    }
  }

  selectTab(tab) {
    this.currentTab = tab;
    this.tabChange.emit(this.currentTab);
  }
}