import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { trim, range, capitalize } from 'lodash';
import * as Papa from 'papaparse';
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
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('resolutionsPreview') resolutionsPreview: TemplateRef<any>;
  @ViewChild('principlesPreview') principlesPreview: TemplateRef<any>;
  @ViewChild('sceneriosPreview') sceneriosPreview: TemplateRef<any>;

  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  modalContent: TemplateRef<any>;

  showKey: string;
  divisions = DIVISIONS;
  chatInput = "";
  tabs;
  voteFileValues = {
    resolutions: '', 
    principles: '',
    scenerios: ''
  }
  voteData = {
    resolutions: undefined,
    principles: undefined,
    scenerios: undefined,
  }
  showModal = false; 

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

  uploadSceneriosData(e) {
    console.log({e})
    this.parseVoteData(e, 'scenerios');
  }

  uploadPrinciplesData(e) {
    this.parseVoteData(e, 'principles');
  }

  uploadResolutionsData(e) {
    this.parseVoteData(e, 'resolutions');
  }

  parsePrinciplesData(_data) {
    const data = _data.map(([title, principle, ...options]) => {
      console.log({options})
      return {
        title,
        prompt: `${principle}:`, 
        result: principle,
        options: options.map(option => option ? ({
          prompt: `${capitalize(option)}`,
          result: option,
          votes: 0
        }) : null)
      }
    })
    data.shift();

    return data;
  }

  parseSceneriosData(_data) {
    const data = _data.map(([title, _header, ...options]) => {
      const header = _header.split('|');

      return {
        title,
        prompt: header[0], 
        result: header[1],
        options: options.map((option, i) => { 
          return option ? { 
            prompt: option.split('|')[0],
            result: option.split('|')[1],
            votes: 0
          } : null
        })
      }
    });
    data.shift();

    return data;
  }

  parseResolutionsData(_data) {
    const data = _data.map(([title, _header, _costs, _consequences, ...options]) => {
      const header = _header.split('|');
      const costs = _costs.split('|');
      const consequences = _consequences.split('|');

      return {
        title: title.trim(),
        prompt: header[0], 
        result: header[1],
        options: options.map((option, i) => { 
          return option ? { 
            prompt: option.split('|')[0],
            result: option.split('|')[1],
            cost: costs[i] ?? 0,
            consequence: consequences[i] ?? 'none',
            votes: 0
          } : null
        })
      }
    });
    data.shift();

    return data;
  }

  parseVoteData(e, type) {
    Papa.parse(e.target.files[0], {
      transform: function(value) {
        return value === '' ? null : value
      },
      complete: (results) => {
        let data;
        if (type === 'resolutions') {
          data = this.parseResolutionsData(results.data);
        } else if (type === 'principles') {
          data = this.parsePrinciplesData(results.data);
        } else if (type === 'scenerios') {
          data = this.parseSceneriosData(results.data);
        }
        console.log("parsed data: ", data)
        this.voteData[type] = data;
        this.previewVoteData(type);
      }
    });
  }

  cancelUpdate(type) {
    this.showModal = false;
    this.voteFileValues[type] = '';
  }

  updateVoteData(type) {
    console.log('update vote data for ', type)
    this.db.object(type)
      .set(this.voteData[type])
      .then(() => {
        this.showModal = false;
        this.voteFileValues[type] = '';
        alert(`Update successful for ${type} file`)
      })
  }

  previewVoteData(type) {
    if (type === 'resolutions') {
      this.modalContent = this.resolutionsPreview;
      this.showModal = true;
    } else if (type === 'principles') {
      this.modalContent = this.principlesPreview;
      this.showModal = true;
    } else if (type === 'scenerios') {
      this.modalContent = this.sceneriosPreview;
      this.showModal = true;
    }
  }

  newShow() {
    const divisions = this.generateDivisions();
    this.db.list('shows')
      .push({ divisions, ...SHOW_TEMPLATE })
      .then((res) => { this.buildShow(res.key) })
  }

  wipeShows() {
    this.db.object('shows').remove();
  }

  submitChat(division) {
    if (!trim(this.chatInput)) return;
    
    this.db.list(`shows/${this.showKey}/feeds/${division}`)
      .push({ from: 'central', type: 'chat', value: this.chatInput })
      .then((res) => { 
        this.chatInput = "";
      })
  }

  sendEvent(division) {
    this.db.list(`shows/${this.showKey}/feeds/${division}`)
      .push({ from: 'central', type: 'event', value: 'This is an event!' })
  }

  sendBroacastNotification(division) {
    this.db.list(`shows/${this.showKey}/feeds/${division}`)
      .push({ from: 'central', type: 'broadcast' })
  }

  buildShow(key) {
    this.db.object(`shows/${key}`).valueChanges()
      .pipe(take(1))
      .subscribe((show) => {
        this.showKey = key;
      })
  }

  generateDivisions() {
    console.log('gen div: ', DIVISION_TEMPLATE)
    return DIVISIONS.reduce((acc, abv) => ({ 
      ...acc, 
      [abv]: { 
        ...DIVISION_TEMPLATE,
        code: abv, 
        landTiles: this.generateLandTiles(),
        citizens: this.generateCitizens(abv),
      } 
    }), {});
  }

  generateCitizens(division) {
    const citizens = CITIZEN_NAMES.map((name, index) => ({
      name,
      id: `${division}${index + 1}${name}`,
      position: index + 1,
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
