import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take } from 'rxjs/operators';
import { timer, combineLatest, Observable } from 'rxjs';
import { trim, keyBy, range, capitalize, toNumber, find, differenceWith, sortBy } from 'lodash';
import * as Papa from 'papaparse';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE } from './templates';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

const DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW'];
const COLORS = {
  E: '#4286f4',
  N: '#000000',
  NE: '#660300',
  NW: '#34a853',
  S: '#bf7221',
  SE: '#a296c0',
  SW: '#42b3bd',
  W: '#eeb303'
}
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
  @ViewChild('users') usersTab: TemplateRef<any>;
  @ViewChild('showBody') showBody: TemplateRef<any>;
  @ViewChild('summaryBody') summaryBody: TemplateRef<any>;
  @ViewChild('usersBody') usersBody: TemplateRef<any>;

  @ViewChild('fileUpload') fileUpload: ElementRef;

  @ViewChild('resolutionsPreview') resolutionsPreview: TemplateRef<any>;
  @ViewChild('principlesPreview') principlesPreview: TemplateRef<any>;
  @ViewChild('sceneriosPreview') sceneriosPreview: TemplateRef<any>;
  @ViewChild('eventsPreview') eventsPreview: TemplateRef<any>;
  @ViewChild('usersPreview') usersPreview: TemplateRef<any>;
  @ViewChild('timelinePreview') timelinePreview: TemplateRef<any>;
  @ViewChild('eventTemplate') eventTemplate: TemplateRef<any>;
  @ViewChild('addUserCodeTemplate') addUserCodeTemplate: TemplateRef<any>;

  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  $timeline: Observable<any>;
  $time: Observable<any>;
  $contamination: Observable<any>;

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

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.showKey = this.route.snapshot.params.show;
    this.db.object(`events`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((events) => {
        this.globalEvents = events;
      })
    this.$contamination = this.db.object(`shows/${this.showKey}/contamination`).valueChanges();
    this.$timeline = this.db.list('timeline').valueChanges();
    this.$time = combineLatest(
      this.db.object(`shows/${this.showKey}/startTime`).valueChanges(),
      timer(0, 1000).pipe(map(() => new Date())),
      this.db.object(`shows/${this.showKey}/live`).valueChanges()
    ).pipe(
      map(([start, clock, live]) => {
        const a = moment(start);
        const b = moment(clock.getTime());
        const time = Math.floor(moment.duration(b.diff(a)).asMinutes());
        return { start, clock, time, live }
      })
    )
  }

  ngAfterViewInit() {
    const bodyTemplates = this.bodyTemplates.toArray();
    const tabTemplates = this.tabTemplates.toArray();

    setTimeout(() => {
      this.tabs = [
        { id: 'show', tabTemplate: this.showTab, bodyTemplate: this.showBody },
        { id: 'users', tabTemplate: this.usersTab, bodyTemplate: this.usersBody },
        { id: 'summary', tabTemplate: this.summaryTab, bodyTemplate: this.summaryBody },
        ...this.divisions.map((div, i) => {
          return { id: div, tabTemplate: tabTemplates[i], bodyTemplate: bodyTemplates[i] }
        })
      ]
    })
  }

  stopClock() {
    this.db.object(`shows/${this.showKey}/live`).set(false);
  }

  startClock() {
    const date = new Date();
    console.log('start clock: ', date)

    this.db.object(`shows/${this.showKey}`).update({
      live: true,
      startTime: date.getTime(),
    });
  }

  onContaminationChange(amount) {
    this.db.object(`shows/${this.showKey}/contamination/current`).set(amount);
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
    let data = this.csvData[type];
    let updatePath = type;
    if (type === 'users') {
      data = keyBy(this.csvData.users, 'code');
      updatePath = `shows/${this.showKey}/users`;
    }
    console.log('update vote data for ', type)
    this.db.object(updatePath)
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

  async resetShow() {
    if (!confirm("This will reset all show data. Are you sure you want to do this?")) {
      return
    }
    let users = await this.db.object(`shows/${this.showKey}/users`)
      .valueChanges()
      .pipe(take(1))
      .toPromise()

    console.log({users})

    const divisions = this.generateDivisions();
    this.db.object(`shows/${this.showKey}`).set({
      divisions,
      ...SHOW_TEMPLATE,
      users: Object.keys(users).reduce((acc, key) => {
        return { ...acc, [key]: {
          ...users[key],
          division: null,
          name: null
        }}
      }, {})
    }).then((res) => {
      this.buildShow(this.showKey)
    })
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
        color: COLORS[abv],
        code: abv, 
        landTiles: this.generateLandTiles(),
        // citizens: this.generateCitizens(abv)
      } 
    }), {});
  }


  newUserCode() {
    this.modalContent = this.addUserCodeTemplate;
    this.showModal = true;
  }

  addUserCode(code) {
    this.db.object(`shows/${this.showKey}/users/${code}`).set({
      code
    }).then(() => this.showModal = false )
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
