import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { trim, keyBy, range, capitalize, toNumber, find, differenceWith, sortBy } from 'lodash';
import * as Papa from 'papaparse';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE } from './templates';

const DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW'];
const MAX_HARVEST = 49;
const CITIZEN_NAMES = ['Sam', 'Mark', 'Mandy', 'Sarah', 'Kimmy', 'Zed'];
const ADVANCEMENTS = ["safety", "health", "arts", "knowledge", "infrastructure"];


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
  @ViewChild('eventsPreview') eventsPreview: TemplateRef<any>;
  @ViewChild('usersPreview') usersPreview: TemplateRef<any>;
  @ViewChild('timelinePreview') timelinePreview: TemplateRef<any>;

  @ViewChild('eventTemplate') eventTemplate: TemplateRef<any>;

  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  $timeline: Observable<any>;

  modalContent: TemplateRef<any>;
  showKey: string;
  divisions = DIVISIONS;
  chatInput = "";
  tabs;
  csvFileData = {
    resolutions: '', 
    principles: '',
    scenerios: '',
    events: '', 
    users: '',
    timeline: '',
  }
  csvData = {
    resolutions: undefined,
    principles: undefined,
    scenerios: undefined,
    events: undefined, 
    users: undefined,
    timeline: undefined,
  }
  showModal = false; 
  globalEvents;

  selectedDivision;
  divisionDropdownOptions;
  divisionDropdownValue;
  divisionDropdownSelect;
  divisionEventVariables;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.showKey = 'main';
    this.db.object(`events`).valueChanges().pipe(take(1)).subscribe((events) => {
      this.globalEvents = events;
      console.log({events})
    })
    this.$timeline = this.db.list('timeline').valueChanges();
    // this.db.list('shows', ref => ref.limitToLast(1))
    //   .snapshotChanges()
    //   .pipe(take(1))
    //   .subscribe(([snapshot]) => {
    //     this.showKey = snapshot.key
    //   })
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
    this.parseCsvData(e, 'scenerios');
  }

  uploadPrinciplesData(e) {
    this.parseCsvData(e, 'principles');
  }

  uploadResolutionsData(e) {
    this.parseCsvData(e, 'resolutions');
  }

  uploadEventsData(e) {
    this.parseCsvData(e, 'events');
  }

  uploadUsersData(e) {
    this.parseCsvData(e, 'users');
  }

  uploadTimelineData(e) {
    this.parseCsvData(e, 'timeline');
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

  parseTimelineData(_data) {
    const data = _data.map(([time, action, action2, notes]) => {
      return {
        time, 
        action, 
        action2,
        notes
      }
    });
    data.shift();
    return data;
  }

  parseUsersData(_data) {
    const data = _data.map(([code, email, phone]) => {
      return {
        code, 
        email, 
        phone
      }
    })
    data.shift();
    return data;
  }

  parseEventsData(_data) {
    const data = _data.map(([_title, _event, _level, _variables]) => {
      const selectVariableNames = new RegExp(/[^{\}]+(?=})/, 'g');
      const variableNames = _event.match(selectVariableNames);
      const variables = [];

      let content = [_event];

      if (variableNames !== null) {
        const values = _variables.split('|') ?? [];
        variableNames.forEach((name, i) => {
          const [ tail, ...head ] = content.reverse();
          const newContent = tail.split(`{${name}}`);
          content = [...head, ...newContent]
          console.log('content: ', content)
          variables.push({
            id: name,
            value: toNumber(values[i])
          })
        })
      }

      return {
        title: _title,
        content,
        level: toNumber(_level),
        variables
      }
    })
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

  parseCsvData(e, type) {
    Papa.parse(e.target.files[0], {
      transform: function(value) {
        return value ?? null;
      },
      complete: (results) => {
        let data;
        if (type === 'resolutions') {
          data = this.parseResolutionsData(results.data);
        } else if (type === 'principles') {
          data = this.parsePrinciplesData(results.data);
        } else if (type === 'scenerios') {
          data = this.parseSceneriosData(results.data);
        } else if (type === 'events') {
          data = this.parseEventsData(results.data);
        } else if (type === 'users') {
          data = this.parseUsersData(results.data);
        } else if (type === 'timeline') {
          data = this.parseTimelineData(results.data);
        }
        console.log("parsed data: ", data)
        this.csvData[type] = data;
        this.previewCsvData(type);
      }
    });
  }

  cancelUpdate(type) {
    this.showModal = false;
    this.csvFileData[type] = '';
  }

  updateCsvData(type) {
    const data = type === 'users' 
      ? keyBy(this.csvData.users, 'code')
      : this.csvData[type];
    console.log('update vote data for ', type)
    this.db.object(type)
      .set(data)
      .then(() => {
        this.showModal = false;
        this.csvFileData[type] = '';
        alert(`Update successful for ${type} file`)
      })
  }

  previewCsvData(type) {
    if (type === 'resolutions') {
      this.modalContent = this.resolutionsPreview;
    } else if (type === 'principles') {
      this.modalContent = this.principlesPreview;
    } else if (type === 'scenerios') {
      this.modalContent = this.sceneriosPreview;
    } else if (type === 'events') {
      this.modalContent = this.eventsPreview;
    } else if (type === 'users') {
      this.modalContent = this.usersPreview;
    } else if (type === 'timeline') {
      this.modalContent = this.timelinePreview;
    }
    this.showModal = true;
  }



  newShow(name) {
    const divisions = this.generateDivisions();
    this.db.object(`shows/${name}`).set({ divisions, ...SHOW_TEMPLATE }).then((res) => {
      this.buildShow(name)
    })
    // this.db.list('shows')
    //   .push({ divisions, ...SHOW_TEMPLATE })
    //   .then((res) => { this.buildShow(res.key) })
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

  onDivisionOptionChange(type) {
    this.divisionDropdownSelect = find(this.divisionDropdownOptions, (div) => div.title === this.divisionDropdownValue);
    if (type === 'event') {
      this.divisionEventVariables = this.divisionDropdownSelect?.variables;
    }
  }

  getEvent(division) {
    this.showModal = true;
    this.selectedDivision = division;
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).valueChanges().pipe(take(1)).subscribe((events) => {
      console.log('build dat list: ', this.globalEvents, events)
      this.divisionDropdownOptions = differenceWith(
        this.globalEvents,
        events,
        (g, e) => g.title === e.header
      );
      this.divisionDropdownOptions = sortBy(this.divisionDropdownOptions, ['level']);
      console.log('options: ', this.divisionDropdownOptions)
    })
    this.modalContent = this.eventTemplate;
  }

  setOption(type) {
    this.sendEvent(this.selectedDivision, this.divisionDropdownSelect);
    this.showModal = false;
  }

  sendEvent(division, event) {
    console.log('event: ', division, event)
    const value = event.content.map((block, index) => this.divisionEventVariables?.[index]?.value
      ? `${block} <strong>${this.divisionEventVariables[index]?.value}</strong>`
      : block
    ).join('');
    const news = { from: 'central', header: event?.title, type: 'event', value };
    this.db.list(`shows/${this.showKey}/feeds/${division}`).push(news);
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).push(news);
  }

  sendBroacastNotification(division) {
    const news = { from: 'central', type: 'broadcast' };
    this.db.list(`shows/${this.showKey}/feeds/${division}`).push(news);
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).push(news);
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
        citizens: this.generateCitizens(abv)
      } 
    }), {});
  }

  generateCitizens(division) {
    const users = CITIZEN_NAMES.reduce((acc, name, index) => ({
      ...acc,
      [`${division}${index + 1}${name}`]: {
        name,
        actions: 2,
        id: `${division}${index + 1}${name}`,
        position: index + 1,
        advancements: ADVANCEMENTS.reduce((acc, type) => ({
          ...acc,
          [type]: 0
        }), {})
      }
    }), {})
    return users;
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
