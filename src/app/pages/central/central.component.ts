import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take, tap, takeUntil } from 'rxjs/operators';
import { timer, combineLatest, Observable, Subject, forkJoin, pipe } from 'rxjs';
import { trim, keyBy, range, capitalize, toNumber, find, differenceWith, sortBy, includes } from 'lodash';
import * as Papa from 'papaparse';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE } from './templates';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { pluckRandom, getRandomInt } from 'src/app/utilties';

const DIVISIONS = ['N', 'S', 'E', 'W', 'NE', 'SE', 'SW', 'NW'];
const DIVISION_NAMES = {
  N: 'North Division',
  S: 'South Division',
  E: 'East Division',
  W: 'West Division',
  NW: 'NorthWest Division',
  NE: 'NorthEast Division',
  SW: 'SouthWest Division',
  SE: 'SouthEast Division'
}
const COLORS = {
  E: '#3A84FF',
  NE: '#660000',
  N: '#C82687',
  NW: '#25BA4D',
  S: '#CA7216',
  SE: '#6C4EF2',
  SW: '#30C6D4',
  W: '#EEB201'
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
  @ViewChild('scenariosPreview') scenariosPreview: TemplateRef<any>;
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
  $unseenMessages: Observable<any>;

  private destroy$ = new Subject<boolean>();

  currentTab;
  time;
  modalContent: TemplateRef<any>;
  showKey: string;
  divisions;
  chatInput = "";
  tabs;
  csvFileData = {
    resolutions: '', 
    principles: '',
    scenarios: '',
    events: '', 
    users: '',
    timeline: '',
  }
  csvData = {
    resolutions: undefined,
    principles: undefined,
    scenarios: undefined,
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
    this.$unseenMessages = this.db.object(`shows/${this.showKey}/centralUnseen`).valueChanges();
    
    this.$time = combineLatest(
      this.db.object(`shows/${this.showKey}/startTime`).valueChanges(),
      timer(0, 1000).pipe(map(() => new Date())),
      this.db.object(`shows/${this.showKey}/live`).valueChanges()
    ).pipe(
      takeUntil(this.destroy$),
      map(([start, clock, live]) => {
        const a = moment(start);
        const b = moment(clock.getTime());
        const time = Math.floor(moment.duration(b.diff(a)).asMinutes());
        return { start, clock, time, live }
      }),
      tap((timer) => {
        this.time = timer.time;
      })
    )

    timer(0, 1000).pipe(
      takeUntil(this.destroy$)
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log("clock: ", this.time);
      this.db.object(`shows/${this.showKey}/contamination`).query.ref.transaction((contam) => {
        if (contam && this.time > 0) {
          const timeFraction = Math.min(1, this.time / (contam.end - contam.start));
          const range = contam.max - contam.min;
          const newLevel = contam.start > this.time
            ? contam.min
            : Math.round((timeFraction * range) + contam.min);
          console.log({timeFraction, range, newLevel})
          return { ...contam, current: newLevel }
        }

        return contam
      })
    })

    this.divisions = DIVISIONS;
  }

  ngAfterViewInit() {
    const bodyTemplates = this.bodyTemplates.toArray();
    const tabTemplates = this.tabTemplates.toArray();

    setTimeout(() => {
      this.tabs = [
        { id: 'show', tabTemplate: this.showTab, bodyTemplate: this.showBody },
        { id: 'users', tabTemplate: this.usersTab, bodyTemplate: this.usersBody },
        { id: 'summary', tabTemplate: this.summaryTab, bodyTemplate: this.summaryBody },
        ...DIVISIONS.map((div, i) => {
          return { id: div, tabTemplate: tabTemplates[i], bodyTemplate: bodyTemplates[i] }
        })
      ]
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onTabChange(tab) {
    if (includes(DIVISIONS, tab.id)) {
      this.db.object(`shows/${this.showKey}/centralUnseen/${tab.id}`).set(0)
    }
    if (tab.id !== this.currentTab && includes(DIVISIONS, this.currentTab)) {
      this.db.object(`shows/${this.showKey}/centralUnseen/${this.currentTab}`).set(0)
    }
    this.currentTab = tab.id;
  }

  stopClock() {
    this.db.object(`shows/${this.showKey}/live`).set(false);
  }

  startClock() {
    const date = new Date();

    this.db.object(`shows/${this.showKey}`).update({
      live: true,
      startTime: date.getTime(),
    });
  }

  onContaminationChange(amount) {
    this.db.object(`shows/${this.showKey}/contamination/current`).set(amount);
  }

  uploadScenariosData(e) {
    this.parseCsvData(e, 'scenarios');
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
    const data = _data.map(([title, principle, _remarks, ...options]) => {
      console.log({options})
      const remarks = _remarks.split('|');
      return {
        title,
        prompt: `${principle}:`, 
        result: principle,
        options: options.map((option, i) => option ? ({
          prompt: `${capitalize(option)}`,
          result: option,
          remark: remarks[i],
          votes: 0
        }) : null)
      }
    })
    data.shift();

    return data;
  }

  parseScenariosData(_data) {
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


  onChangeContamMin(value) {
    console.log('contam end: ', value);
    this.db.object(`shows/${this.showKey}/contamination/min`).set(value);
  }


  onChangeContamMax(value) {
    console.log('contam end: ', value);
    this.db.object(`shows/${this.showKey}/contamination/max`).set(value);
  }

  onChangeContamStart(value) {
    console.log("contam start: ", value);
    this.db.object(`shows/${this.showKey}/contamination/start`).set(value);
  }

  onChangeContamEnd(value) {
    console.log('contam end: ', value);
    this.db.object(`shows/${this.showKey}/contamination/end`).set(value);
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
        } else if (type === 'scenarios') {
          data = this.parseScenariosData(results.data);
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
    } else if (type === 'scenarios') {
      this.modalContent = this.scenariosPreview;
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

    const divisions = this.generateDivisions();
    await this.db.object(`shows/${this.showKey}`).remove();
    this.db.object(`shows/${this.showKey}`).set({
      divisions,
      ...SHOW_TEMPLATE,
      users: users ? Object.keys(users).reduce((acc, key) => {
        return { ...acc, [key]: {
          ...users[key],
          division: null,
          name: null
        }}
      }, {}) : null
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

    this.db.object(`shows/${this.showKey}/divisions/${division}/unseenChat`)
      .query.ref.transaction((unseen) => unseen ? ++unseen : 1)
  }

  onDivisionOptionChange(type) {
    this.divisionDropdownSelect = find(this.divisionDropdownOptions, (div) => div.title === this.divisionDropdownValue);
    if (type === 'event') {
      this.divisionEventVariables = this.divisionDropdownSelect?.variables;
      console.log('DIV vars: ', this.divisionEventVariables)
    }
  }

  getEvent(division) {
    this.showModal = true;
    this.selectedDivision = division;
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).valueChanges().pipe(take(1)).subscribe((events) => {
      this.divisionDropdownOptions = differenceWith(
        this.globalEvents,
        events,
        (g, e) => g.title === e.header
      );
      this.divisionDropdownOptions = sortBy(this.divisionDropdownOptions, ['level']);
    })
    this.modalContent = this.eventTemplate;
  }

  onClickNewEvent(div) {
    this.getEvent(div);
  }

  setOption(type) {
    this.sendEvent(this.selectedDivision, this.divisionDropdownSelect);
    this.showModal = false;
  }

  sendEvent(division, event) {
    const value = event.content.map((block, index) => this.divisionEventVariables?.[index]?.value
      ? `${block} <strong>${this.divisionEventVariables[index]?.value}</strong>`
      : block
    ).join('');
    const news = { 
      from: 'central', 
      header: event?.title,
      resolved: false,
      requiresAction: true,
      type: 'event', 
      value,
      timestamp: moment().format('h:mm:ss')
    };
    this.db.object(`shows/${this.showKey}/divisions/${division}/unseenNews`)
      .query.ref.transaction((unseen) => unseen ? ++unseen : 1)
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).push(news);
  }

  sendBroacastNotification(division) {
    const event = { from: 'central', type: 'broadcast' };
    this.db.list(`shows/${this.showKey}/feeds/${division}`).push(event);
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`).push(event);
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
        color: COLORS[abv],
        code: abv, 
        name: DIVISION_NAMES[abv],
        divisionReview: abv,
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
        actions: 0,
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
    const tiles = slots.map((_, index) => ({ 
      value: -1, 
      owner: null, 
      harvested: false,
      type: 'R',
      contaminated: false,
      mark: null, 
      index
     }))
     const plucked = pluckRandom(tiles, 18);
     plucked.forEach((x, i) => {
       let value = 1;
       if (i > 5) { value += (i > 11) ? 2 : 1 }
       tiles[x.index].value = value;
     })
    return tiles;
  }
}
