import { FOCUS_BUTTONS } from './../../../pages/host/constants';
import { Component, Input, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as rx from 'rxjs/operators';
import * as _ from 'lodash';
import { DatabaseService } from 'src/app/services/database-service.service';

@Component({
  selector: 'app-focus-tab',
  templateUrl: './focus-tab.component.html',
  styleUrls: ['./focus-tab.component.scss'],
  host: {
    '[class.app-focus-tab]': 'true'
  }
})
export class FocusTabComponent implements OnInit {
  @ViewChild('harvestTemplate') harvestTemplate: TemplateRef<any>;
  @ViewChild('principleTemplate') principleTemplate: TemplateRef<any>;
  @ViewChild('resolutionTemplate') resolutionTemplate: TemplateRef<any>;
  @ViewChild('resolutionReviewModalTemplate') resolutionReviewModalTemplate: TemplateRef<any>;
  @ViewChild('scenarioTemplate') scenarioTemplate: TemplateRef<any>;
  @ViewChild('miscTemplate') miscTemplate: TemplateRef<any>;
  @ViewChild('reviewTemplate') reviewTemplate: TemplateRef<any>;

  public $focus: Observable<any>;
  public $playerView: Observable<any>;
  public $pageState: Observable<any>;
  public $vote: Observable<any>;
  public $actions: Observable<any>;
  public $capacity: Observable<any>;
  public $turnButtons: Observable<any>;
  public $turn: Observable<any>;
  public $divisionReview: Observable<any>;

  modalContent: TemplateRef<any>;
  focusButtons = FOCUS_BUTTONS;
  voteDropdown;
  focus;
  voteType;

  private _voteDropdownSelect;
  get voteDropdownSelect() { return this._voteDropdownSelect };
  set voteDropdownSelect(value) {
    this._voteDropdownSelect = value;
    if (this.focus) {
      this.startVote(this.focus);
    }
  }

  @Input() showKey;
  @Input() divisionKey;

  constructor(
   public dbService: DatabaseService
  ){
    this.$focus = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'focus');
    this.$playerView = this.dbService.getReserveData(this.showKey, this.divisionKey);
    this.$pageState = this.dbService.getPageState(this.showKey, this.divisionKey);
    this.$vote = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'vote');
    this.$actions = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'actions');
    this.$capacity = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'capacity');
    this.$turnButtons = this.dbService.getTurnButtons(this.showKey, this.divisionKey);
    this.$turn = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'turn');
    this.$divisionReview = this.dbService.getDivisionObject(this.showKey, this.divisionKey, 'divisionReview');
  }

  ngOnInit() {
    this.getResolutions();
    this.getPrinciples();
    this.getScenarios();
  }

  autoPick(focus) {
    console.log('autopick: ', focus, this.voteDropdown, this.voteDropdownSelect)
    const untouched = this.voteDropdown.filter((option) => !option.votedOn);
    this.voteDropdownSelect = pluckRandom(untouched, 1)[0];
  }

  onFocusSelect(button) {
    this.setFocus(button.id);
  }

  async setFocus(type) {
    console.log('set focus: ', type)
    const lastResolution = await promiseOne(this.db.object(`${this.divisionPath}/lastResolution`))

    if (type === 'principles') {
      this.setVoteDropdown('principles');
      this.modalContent = this.principleTemplate;
    } else if (type === 'resolutions') {
      if (lastResolution && !this.ipad) {
        this.modalContent = this.resolutionReviewModalTemplate;
      } else {
        this.setVoteDropdown('resolutions');
        this.modalContent = this.resolutionTemplate;
      }
    } else if (type === 'scenario') {
      this.setVoteDropdown('scenarios');
      this.modalContent = this.scenarioTemplate;
    } else if (type === 'harvest') {
      this.modalContent = this.harvestTemplate;
    } else if (type === 'misc') {
      this.modalContent = this.miscTemplate;
    } else if (type === 'review') {
      this.modalContent = this.reviewTemplate;
    }
    this.showModal = true;
  }

  setVoteDropdown(type) {
    console.log('set vote dropdown: ', type)
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    
    if (type === 'resolutions') {
      this.db.list(`${divisionPath}/resolutions`).valueChanges().pipe(rx.take(1))
      .subscribe(async (resolutions) => {
          console.log({resolutions})
          this.voteType = 'resolution';
          await this.getResolutions();
          this.voteDropdown = this.globalResolutions.map((resolution) => {
            return (_.find(resolutions, ['title', resolution.title])) 
              ? { ...resolution, votedOn: true }
              : resolution
          });
          console.log("VOTE DROPDOWN: ", this.voteDropdown)
        });
    } else if (type === 'principles') {
      this.db.list(`${divisionPath}/principles`).valueChanges().pipe(rx.take(1))
        .subscribe(async (principles) => {
          this.voteType = 'principle';
          await this.getPrinciples();
          this.voteDropdown = this.globalPrinciples.map((principle) => {
            return (_.find(principles, ['title', principle.title])) 
              ? { ...principle, votedOn: true }
              : principle;
          });
          console.log("VOTE DROPDOWN: ", this.voteDropdown)
        })
    } else if (type === 'scenarios') {
      this.db.list(`${divisionPath}/scenarios`).valueChanges().pipe(rx.take(1))
        .subscribe(async (scenarios) => {
          this.voteType = 'scenario';
          await this.getScenarios();
          this.voteDropdown = this.globalScenarios.map((scenario) => {
            return (_.find(scenarios, ['title', scenario.title]))
              ? { ...scenario, votedOn: true }
              : scenario
          })
        })
    }
  }

  async getPrinciples() {
    return new Promise((resolve) => {
      this.db.list(`principles`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((principles) => {
        this.globalPrinciples = principles;
        resolve(principles);
      });
    })
  }

  async getResolutions() {
    return new Promise((resolve) => {
      this.db.list(`resolutions`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((resolutions) => {
        this.globalResolutions = resolutions;
        resolve(resolutions);
      });
    })
  }

  async getScenarios() {
    return new Promise((resolve) => {
      return this.db.list(`scenarios`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((scenarios) => {
        this.globalScenarios = scenarios;
        resolve(scenarios);
      });
    })
  }

}