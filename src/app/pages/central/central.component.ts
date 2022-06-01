import { DivisionService } from './../../services/division-service.service';
import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, TemplateRef, ElementRef, OnDestroy, QueryList } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { take, tap, takeUntil } from 'rxjs/operators';
import { timer, combineLatest, Observable, Subject } from 'rxjs';
import { reverse, toArray, trim, find, differenceWith, sortBy, includes, reduce } from 'lodash';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';


const DIVISIONS = ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW'];

@Component({
  selector: 'app-central',
  templateUrl: './central.component.html',
  styleUrls: ['./central.component.scss'],
  host: {
    '[class.app-central]': 'true'
  }
})
export class CentralComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('show') showTab: TemplateRef<any>;
  @ViewChild('summary') summaryTab: TemplateRef<any>;
  @ViewChild('users') usersTab: TemplateRef<any>;
  @ViewChild('finalVote') finalVoteTab: TemplateRef<any>;
  @ViewChild('showBody') showBody: TemplateRef<any>;
  @ViewChild('summaryBody') summaryBody: TemplateRef<any>;
  @ViewChild('usersBody') usersBody: TemplateRef<any>;
  @ViewChild('finalVoteBody') finalVoteBody: TemplateRef<any>;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('eventTemplate') eventTemplate: TemplateRef<any>;
  @ViewChild('addUserCodeTemplate') addUserCodeTemplate: TemplateRef<any>;

  @ViewChildren('division') bodyTemplates: QueryList<TemplateRef<any>>;
  @ViewChildren('tab') tabTemplates: QueryList<TemplateRef<any>>;

  $timeline: Observable<any>;
  $time: Observable<any>;
  $contamination: Observable<any>;
  $unseenMessages: Observable<any>;
  $divisionAlerts: Observable<any>;
  $finalVote: Observable<any>;

  private destroy$ = new Subject<boolean>();

  currentTab;
  time;
  modalContent: TemplateRef<any>;
  showKey: string;
  divisions;
  chatInput = "";
  tabs;
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
      this.db.object(`shows/${this.showKey}/pauseAtMinute`).valueChanges(),
      timer(0, 1000).pipe(map(() => new Date())),
      this.db.object(`shows/${this.showKey}/live`).valueChanges()
    ).pipe(
      takeUntil(this.destroy$),
      map(([start, pauseAtMinute, clock, live]) => {
        const a = moment(start);
        const b = moment(clock.getTime());
        const time = Math.floor(moment.duration(b.diff(a)).asMinutes());
        return { start, clock, time, live, paused: pauseAtMinute !== null }
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

  onTabChange(tab) {
    if (includes(DIVISIONS, tab.id)) {
      this.db.object(`shows/${this.showKey}/centralUnseen/${tab.id}`).set(0)
    }
    if (tab.id !== this.currentTab && includes(DIVISIONS, this.currentTab)) {
      this.db.object(`shows/${this.showKey}/centralUnseen/${this.currentTab}`).set(0)
    }
    this.currentTab = tab.id;
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

  newUserCode() {
    this.modalContent = this.addUserCodeTemplate;
    this.showModal = true;
  }

  addUserCode(code) {
    this.db.object(`shows/${this.showKey}/users/${code}`).set({
      code
    }).then(() => this.showModal = false )
  }
}
