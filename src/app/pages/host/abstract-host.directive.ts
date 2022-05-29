import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import * as _ from 'lodash';
import { Observable, Subject, combineLatest } from 'rxjs';
import * as rx from 'rxjs/operators'
import { DivisionService } from 'src/app/services/division-service.service';
import { DatabaseService } from 'src/app/services/database-service.service';


@Component({
  template: ''
})
export class AbstractHostComponent<T = any> implements OnInit, OnDestroy {
    public destroy$ = new Subject<boolean>();

    // Keep these
    public divisionKey: string;
    public showKey: string;
    public divisionPath: string;

    // Not sure if should keep
    public voteState: string;
    public $division: Observable<any>;

    // Observables
    public $advancements: Observable<any>;
    public $actions: Observable<any>;
    public $capacity: Observable<any>;
    public $divisionReview: Observable<any>;
    public $exports: Observable<any>;
    public $globalLand: Observable<any>;
    public $lastResolution: Observable<any>;
    public $localLand: Observable<any>;
    public $pendingGLA: Observable<any>;
    public $pageState: Observable<any>;
    public $playerView: Observable<any>;
    public $principles: Observable<any>;
    public $resolutions: Observable<any>;
    public $reserveData: Observable<any>;
    public $sell: Observable<any>;
    public $scenarios: Observable<any>;
    public $turn: Observable<any>;
    public $unseenNotifications: Observable<any>;
    public $unseenChat: Observable<any>;
    public $unseenNews: Observable<any>;
    public $vote: Observable<any>;

    constructor(
        public dbService: DatabaseService,
        public db: AngularFireDatabase,
        public route: ActivatedRoute,
        public divisionService: DivisionService
    ) {}

    ngOnInit() {
        this.divisionKey = this.route.snapshot.params.division;
        this.showKey = this.route.snapshot.params.show;
        this.divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;

        this.setObservables();
        this.reloadOnShowReset();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    reloadOnShowReset() {
        this.db.object('shows').valueChanges().pipe(
            rx.takeUntil(this.destroy$)
        ).subscribe(
            (shows) => {
            if (!shows[this.showKey]) {
                window.location.reload();
            }
        })
    }

    setObservables() {
        this.$division = this.dbService.getDivision(this.showKey, this.divisionKey);
        this.$actions = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'actions');
        this.$advancements = this.dbService.getAdvancements(this.showKey, this.divisionKey);
        this.$capacity = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'capacity');
        this.$divisionReview = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'divisionReview');
        this.$exports = this.dbService.getExports(this.showKey, this.divisionKey);
        this.$globalLand = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'globalLand');
        this.$lastResolution = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'lastResolution');
        this.$localLand = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'localLand');
        this.$resolutions = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'resolutions');
        this.$pendingGLA = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'pendingGLA');
        this.$principles = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'principles');
        this.$pageState = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'focus');
        this.$playerView = this.dbService.getPlayerView(this.showKey, this.divisionKey);
        this.$reserveData = this.dbService.getReserveData(this.showKey, this.divisionKey);
        this.$sell = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'sell');
        this.$scenarios = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'scenarios');
        this.$turn = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'turn');
        this.$unseenNotifications = this.dbService.getDivisionList(this.showKey, this.divisionKey, 'unseenNotifications');
        this.$unseenChat = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'unseenChat');
        this.$unseenNews = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'unseenNews');
        this.$vote = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'vote');
    }
}
