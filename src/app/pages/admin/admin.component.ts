import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ElementRef, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take, takeUntil, tap } from 'rxjs/operators';
import { timer, Observable, Subject, combineLatest } from 'rxjs';
import { reverse, toArray, reduce, trim, keyBy, range, capitalize, toNumber, find, differenceWith, sortBy } from 'lodash';
import * as Papa from 'papaparse';
import { DIVISION_TEMPLATE, SHOW_TEMPLATE, SHOW_DEFAULTS } from './templates';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { formatDate, pluckRandom, promiseOne } from 'src/app/utilties';
import { TimelineComponent } from 'src/app/components/shared/timeline/timeline.component';
import { DivisionService } from './../../services/division-service.service';

const DIVISIONS = ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW'];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIVISION_NAMES = {
  N: 'North',
  S: 'South',
  E: 'East',
  W: 'West',
  NW: 'NorthWest',
  NE: 'NorthEast',
  SW: 'SouthWest',
  SE: 'SouthEast'
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
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  host: {
    '[class.app-central]': 'true'
  }
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('show') showTab: TemplateRef<any>;
  @ViewChild('summary') summaryTab: TemplateRef<any>;
  @ViewChild('users') usersTab: TemplateRef<any>;
  @ViewChild('finalVote') finalVoteTab: TemplateRef<any>;
  @ViewChild('showBody') showBody: TemplateRef<any>;
  @ViewChild('summaryBody') summaryBody: TemplateRef<any>;
  @ViewChild('usersBody') usersBody: TemplateRef<any>;
  @ViewChild('finalVoteBody') finalVoteBody: TemplateRef<any>;

  @ViewChild('fileUpload') fileUpload: ElementRef;

  @ViewChild('resolutionsPreview') resolutionsPreview: TemplateRef<any>;
  @ViewChild('principlesPreview') principlesPreview: TemplateRef<any>;
  @ViewChild('scenariosPreview') scenariosPreview: TemplateRef<any>;
  @ViewChild('eventsPreview') eventsPreview: TemplateRef<any>;
  @ViewChild('usersPreview') usersPreview: TemplateRef<any>;
  @ViewChild('timelinePreview') timelinePreview: TemplateRef<any>;
  @ViewChild('eventTemplate') eventTemplate: TemplateRef<any>;
  @ViewChild('addUserCodeTemplate') addUserCodeTemplate: TemplateRef<any>;
  @ViewChild('newShowTemplate') newShowTemplate: TemplateRef<any>;

  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  @ViewChild('timeline') timeline: TimelineComponent;

  $contamData: Observable<any>;
  $time: Observable<any>;
  $contamination: Observable<any>;
  $pauseAtMinute: Observable<any>;
  $showSize: Observable<any>;
  $finalVote: Observable<any>;

  private destroy$ = new Subject<boolean>();

  data = [
    [0, 0],
    [20, 10],
    [40, 30],
  ]
  today;

  chart = {
    columns: [
      ['number', 'Time'],
      ['number', 'Path'],
    ],
    options: {
      lineWidth: 4,
      chartArea: {
        left: 30,
        right: 20,
        bottom: 25,
        top: 10
      }
    }
  }

  showSizeDropdown = {
    value: 'full',
    options: [
      { value: 'small' },
      { value: 'medium' },
      { value: 'large' },
      { value: 'full' }
    ]
  };

  showNumber = 1;
  currentTab;
  time;
  pauseAtMinute = null;
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
    private divisionService: DivisionService
  ) {}

  ngOnInit() {
    console.log("DROPDOWNTEST: ", this.showSizeDropdown.options)
    this.today = formatDate(new Date(), 'mmddyy')
    this.showKey = this.route.snapshot.params.show;
    this.db.object(`events`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((events) => {
        this.globalEvents = events;
      })

    this.$contamination = this.db.object(`shows/${this.showKey}/contamination`).valueChanges();
    this.$contamData = this.db.object(`shows/${this.showKey}/contamination`).valueChanges().pipe(
      map((data:any) => ([
        [0, data?.min],
        [data?.start, data?.min],
        [data?.end, data?.max],
        [118, data?.max]
      ]))
    )

    this.$showSize = this.db.object('showSize').valueChanges();

    this.$pauseAtMinute = this.db.object(`shows/${this.showKey}/pauseAtMinute`).valueChanges(),

    this.$time = combineLatest(
      this.db.object(`shows/${this.showKey}/startTime`).valueChanges(),
      this.$pauseAtMinute,
      timer(0, 1000).pipe(map(() => new Date())),
      this.db.object(`shows/${this.showKey}/live`).valueChanges()
    ).pipe(
      takeUntil(this.destroy$),
      map(([start, pauseAtMinute, clock, live]) => {
        const a = moment(start);
        const b = moment(clock.getTime());
        const time = Math.floor(moment.duration(b.diff(a)).asMinutes());
        if (this.timeline && pauseAtMinute !== null && time > pauseAtMinute) {
          this.timeline.insertPause(pauseAtMinute);
          this.db.object(`shows/${this.showKey}/pauseAtMinute`).set(time)
        }
        this.pauseAtMinute = pauseAtMinute;
        return { start, paused: pauseAtMinute !== null, clock, live, time }
      }),
      tap((timer) => {
        this.time = timer.time;
      })
    )

    this.$finalVote = combineLatest(
      DIVISIONS.map((division) => (
        this.db.object(`shows/${this.showKey}/finalVotes/${division}`).valueChanges()
          .pipe(
            map((votes) => ({ division, votes }))
          )
      )
    )).pipe(
      map((finalVotes) => {
        const totals = this.getFinalVoteTotals(finalVotes);
        return {
          finalVotes,
          totals
        };
      })
    )

    timer(0, 1000).pipe(
      takeUntil(this.destroy$)
    ).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.db.object(`shows/${this.showKey}/contamination`).query.ref.transaction((contam) => {
        if (contam && this.time > 0) {
          const timeRange = (contam.end - contam.start)
          const timeFraction = Math.min(1, (this.time - contam.start) / timeRange);
          const range = contam.max - contam.min;
          const newLevel = contam.start > this.time
            ? contam.min
            : Math.round((timeFraction * range) + contam.min);
          return { ...contam, current: newLevel }
        }

        return contam
      })
    })

    this.divisions = DIVISIONS;

    this.divisionService.getDivisionAlerts(this.showKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngAfterViewInit() {
    const bodyTemplates = this.bodyTemplates.toArray();
    const tabTemplates = this.tabTemplates.toArray();

    setTimeout(() => {
      this.tabs = [
        { id: 'show', tabTemplate: this.showTab, bodyTemplate: this.showBody },
        { id: 'users', tabTemplate: this.usersTab, bodyTemplate: this.usersBody },
        { id: 'summary', tabTemplate: this.summaryTab, bodyTemplate: this.summaryBody },
        { id: 'final-vote', tabTemplate: this.finalVoteTab, bodyTemplate: this.finalVoteBody },
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

  getFinalVoteTotals(finalVotes) {
    const voteTotals = reduce(finalVotes, (acc, finalVote) => {
      const result = { ...acc };
      if (finalVote.votes) {
        result[finalVote.votes.first.division].value += finalVote.votes.first.weight;
        result[finalVote.votes.second.division].value += finalVote.votes.second.weight;
      }
      return result;
    }, {
      N: { value: 0, division: 'N' },
      E: { value: 0, division: 'E' },
      S: { value: 0, division: 'S' },
      W: { value: 0, division: 'W' },
      NE: { value: 0, division: 'NE' },
      NW: { value: 0, division: 'NW' },
      SE: { value: 0, division: 'SE' },
      SW: { value: 0, division: 'SW' }
    })
    return reverse(sortBy(toArray(voteTotals), ['value']));
  }

  onChangeShowNumber(n) {
    console.log("NEW: ", n)
    this.db.object(`shows/${this.showKey}/showNumber`).set(n).then((n) => console.log("set show nuber: ",n))
  }

  onTabChange(tab) {
    this.currentTab = tab.id;
  }

  pauseClock(min) {
    console.log("pause mr clock", min);
    this.db.object(`shows/${this.showKey}/pauseAtMinute`).set(min);
  }

  resumeClock() {
    this.db.object(`shows/${this.showKey}/pauseAtMinute`).remove();
  }

  async resetTimeline() {
    if (!confirm("Are you sure you want to reset the timeline?")) return;
    await this.db.object(`shows/${this.showKey}/live`).set(false);
    await this.db.object(`shows/${this.showKey}/pauseAtMinute`).remove();
    const timeline = await promiseOne(this.db.object(`timeline`));
    await this.db.object(`shows/${this.showKey}/timeline`).set(timeline)
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

  parseScenariosData(_data: any) {
    const data = _data.map(([
      title,
      _header,
      _secondaryPrompt,
      _secondaryPromptTrigger,
      _secondaryPromptOptions,
      ...options]) => {
      const header = _header.split('|');

      return {
        title,
        prompt: header[0], 
        result: header[1],
        options: options.map((option, i) => {
          return option ? { 
            prompt: option.split('|')[0],
            result: option.split('|')[1],
            secondaryPrompt: (ABC[i] === _secondaryPromptTrigger) ? {
              prompt: _secondaryPrompt,
              options: _secondaryPromptOptions.split('|')
            } : null,
            votes: 0
          } : null
        })
      }
    });
    data.shift();

    console.log("SCENARIOS DATA: ", data)

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

      if (consequences.length > options.length) {
        console.log("add no-action consequence: ", consequences[consequences.length - 1])
      }

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

  async confirmResetShow(showSize) {
    this.modalContent = undefined;
    this.showModal = false;
    console.log('confirm reset for show size: ', showSize);

    await this.db.object('showSize').set(showSize);
    const users = await promiseOne(this.db.object(`shows/${this.showKey}/users`));
    const archive = await promiseOne(this.db.object(`shows/${this.showKey}/archive`));
    const contamination: any = await promiseOne(this.db.object(`shows/${this.showKey}/contamination`));
    const timeline = await promiseOne(this.db.object('timeline'));
    const divisions = this.generateDivisions(showSize);

    console.log("RESET: ", showSize, divisions)
    await this.db.object(`shows/${this.showKey}`).remove();

    this.db.object(`shows/${this.showKey}`).set({
      divisions,
      ...SHOW_TEMPLATE,
      timeline,
      archive,
      users: users ? Object.keys(users).reduce((acc, key) => {
        return { ...acc, [key]: {
          ...users[key],
          division: null,
          name: null
        }}
      }, {}) : null,
      contamination: {
        ...contamination,
        current: contamination?.min ?? 0
      }
    }).then((res) => {
      this.buildShow(this.showKey)
    })
  }

  resetShow() {
    this.modalContent = this.newShowTemplate;
    this.showModal = true;
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
      console.log('DIV vars: ', this.divisionEventVariables)
    }
  }

  getEvent(division) {
    this.showModal = true;
    this.selectedDivision = division;
    this.db.list(`shows/${this.showKey}/divisions/${division}/events`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((events) => {
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

  generateDivisions(showSize = 'full') {
    console.log("gen divisions: ", showSize)
    const DEFAULTS = SHOW_DEFAULTS?.[showSize]
    console.log('set defaults: ', showSize, DEFAULTS)

    return DIVISIONS.reduce((acc, abv) => ({ 
      ...acc, 
      [abv]: { 
        ...DIVISION_TEMPLATE,
        ...DEFAULTS,
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
