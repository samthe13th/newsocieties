import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { toArray, range } from 'lodash';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE } from './templates';

const DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW']
const MAX_HARVEST = 49;
const CITIZEN_NAMES = ['Sam', 'Mark', 'Mandy', 'Sarah', 'Kimmy', 'Zed']


@Component({
  selector: 'app-central',
  templateUrl: './central.component.html',
  styleUrls: ['./central.component.scss'],
  host: {
    '[class.app-central]': 'true'
  }
})
export class CentralComponent implements OnInit, AfterViewInit {
  @ViewChild('show') showTab: TemplateRef<any>;
  @ViewChild('summary') summaryTab: TemplateRef<any>;
  @ViewChild('showBody') showBody: TemplateRef<any>;
  @ViewChild('summaryBody') summaryBody: TemplateRef<any>;
  
  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  showKey: string;
  divisions = DIVISIONS;
  tabs;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.list('shows', ref => ref.limitToLast(1))
      .snapshotChanges()
      .pipe(take(1))
      .subscribe(([snapshot]) => {
        this.showKey = snapshot.key
      })
  }

  ngAfterViewInit() {
    const bodyTemplates = this.bodyTemplates.toArray();
    const tabTemplates = this.tabTemplates.toArray();

    setTimeout(() => {
      this.tabs = [
        { id: 'show', tabTemplate: this.showTab, bodyTemplate: this.showBody },
        { id: 'summary', tabTemplate: this.summaryTab, bodyTemplate: this.summaryBody },
        ...this.divisions.map((div, i) => {
          return { id: div, tabTemplate: tabTemplates[i], bodyTemplate: bodyTemplates[i] }
        })
      ]
    })
  }


  newShow() {
    const divisions = this.generateDivisions();
    console.log({divisions})
    this.db.list('shows').push({ divisions, ...SHOW_TEMPLATE })
      .then((res) => { this.buildShow(res.key) })
  }

  buildShow(key) {
    this.db.object(`shows/${key}`).valueChanges()
      .pipe(take(1))
      .subscribe((show) => {
        this.showKey = key;
      })
  }

  generateDivisions() {
    return DIVISIONS.reduce((acc, abv) => ({ 
      ...acc, 
      [abv]: { 
        ...DIVISION_TEMPLATE,
        code: abv, 
        landTiles: this.generateLandTiles(),
        citizens: this.generateCitizens(),
      } 
    }), {});
  }

  generateCitizens() {
    const citizens = CITIZEN_NAMES.map((name, index) => ({
      name,
      id: index + 1,
      resources: [3,2,1]
    }))
    console.log({citizens});
    return citizens;
  }

  generateLandTiles() {
    const slots = range(MAX_HARVEST);
    return slots.map((_, index) => ({ 
      value: -1, 
      owner: null, 
      harvested: false, 
      contaminated: false,
      mark: null, 
      index
     }))
  }
}
