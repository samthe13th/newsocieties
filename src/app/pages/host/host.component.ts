import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { getRandomInt, pluckRandom } from 'src/app/utilties';
import { LandTile, LandCardValues } from 'src/app/interfaces';
import * as _ from 'lodash';
import { includes, find, range, difference, trim, differenceBy, toNumber, each } from 'lodash';
import { take, map } from 'rxjs/operators'
import { BankService } from 'src/app/services/bank.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { combineLatest } from 'rxjs';
import { ButtonGroupComponent } from 'src/app/components/button-group/button-group.component';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
  host: {
    '[class.app-host]': 'true'
  }
})
export class HostComponent implements OnInit {
  @ViewChild('harvestTemplate') harvestTemplate: TemplateRef<any>;
  @ViewChild('principleTemplate') principleTemplate: TemplateRef<any>;
  @ViewChild('resolutionTemplate') resolutionTemplate: TemplateRef<any>;
  @ViewChild('scenerioTemplate') scenerioTemplate: TemplateRef<any>;
  @ViewChild('miscTemplate') miscTemplate: TemplateRef<any>;

  @ViewChild('focusButtonsComponent') focusButtonsComponent: ButtonGroupComponent;
  @ViewChild('updateSheet') updateSheet: TemplateRef<any>;
  
  modalContent: TemplateRef<any>;

  showModal = false;
  turnButtons = [
    { id: 1, label: 1 },
    { id: 2, label: 2 },
    { id: 3, label: 3 },
    { id: 4, label: 4 },
    { id: 5, label: 5 },
  ]
  focusButtons = [
    { id: 'harvest', label: 'Ha' },
    { id: 'principles', label: 'Pr' },
    { id: 'resolutions', label: 'Re' },
    { id: 'scenerio', label: 'Sc' },
    { id: 'misc', label: 'Mc' },
  ]

  $vote;
  $division;
  $resolutions;
  $principles;
  $scenerios;
  $turn;
  $focus;

  changeAttribute;
  actionSheet;
  voteResultFunds = 0;
  division;
  contamination;
  harvest;
  divisionKey;
  showKey;
  divisionPath;
  landTilesPath;
  chatInput = "";
  focus;
  action = 'harvesting';
  divisionVote;
  voteNotes = "";
  voteType;
  resPrompt = 'Your citizens are addicted to a newly discovered vegetation. Resolve to:';
  resOptions = [
    { id: 'A', value: 'Set-up places for safe consumption and rehabilitation.', selected: false, votes: 0 },
    { id: 'B', value: 'Prohibit the use of the plant.', selected: false, votes: 0  },
    { id: 'C', value: 'Made it their main export and sent it to other divisions.', selected: false, votes: 0 },
    { id: 'D', value: 'Do nothing.', selected: false, votes: 0  },
  ]
  fontSize = 16;
  globalResolutions;
  globalPrinciples; 
  globalScenerios;
  voteDropdown;
  voteDropdownSelect;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private bank: BankService,
    private bottomSheet: MatBottomSheet,
  ) {}

  ngOnInit() {
    this.divisionKey = this.route.snapshot.params.division;
    this.showKey = this.route.snapshot.params.show;
    this.divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    console.log('division path: ', this.divisionPath)
    
    this.landTilesPath = `${this.divisionPath}/landTiles`

    this.$vote = this.db.object(`${this.divisionPath}/vote`).valueChanges();
    this.$division = this.db.object(this.divisionPath).valueChanges();
    this.$resolutions = this.db.list(`${this.divisionPath}/resolutions`).valueChanges();
    this.$principles = this.db.list(`${this.divisionPath}/principles`).valueChanges();
    this.$scenerios = this.db.list(`${this.divisionPath}/scenerios`).valueChanges();
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges();

    this.$focus.subscribe((focus) => {
      console.log({focus})
      this.focus = focus;
    })

    this.db.object(`shows/${this.showKey}/contamination/current`)
      .valueChanges()
      .subscribe((level) => {
        this.adjustContamination(level);
      })

    this.getResolutions();
    this.getPrinciples();
    this.getScenerios();
  }

  onAttributeUpdate(value) {
    this.actionSheet.dismiss();
    console.log('on update: ', value)
  }

  changeDivisionProperty(prop, name=null) {
    console.log("change: ", prop)
    this.changeAttribute = {
      name: name ?? prop,
      dbPath: `${this.divisionPath}/${prop}`
    }
    this.actionSheet = this.bottomSheet.open(this.updateSheet);
  }

  percentHarvested(harvested, capacity) {
    return Math.round((toNumber(harvested)/toNumber(capacity)) * 100)
  }

  getResolutions() {
    this.db.list(`resolutions`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((resolutions) => {
        this.globalResolutions = resolutions
      });
  }

  getPrinciples() {
    this.db.list(`principles`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((principles) => {
        console.log('principles: ', principles)
        this.globalPrinciples = principles
      });
  }

  getScenerios() {
    this.db.list(`scenerios`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((scenerios) => {
        this.globalScenerios = scenerios
      });
  }

  onTurnSelect(button) {
    console.log("turn select: ", button)
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/turn`)
      .set({ index: button.label, actions: 2 })
  }

  onFocusSelect(button) {
    console.log('focus select: ', button);
    this.setFocus(button.id);
  }

  startVote(focus) {
    this.db.object(`${this.divisionPath}/focus`).set(focus);
    console.log('start vote')
    this.showModal = false;
    this.action = 'voting';
    
    this.db.object(`${this.divisionPath}/vote`).set({
      type: this.voteType,
      ...this.voteDropdownSelect,
      state: 'voting',
      voted: "[]"
    })
  }

  setFocus(type) {
    console.log('set ', type)
    this.showModal = true;
    if (type === 'principles') {
      this.setVoteDropdown('principles');
      this.modalContent = this.principleTemplate;
    } else if (type === 'resolutions') {
      this.setVoteDropdown('resolutions');
      this.modalContent = this.resolutionTemplate;
    } else if (type === 'scenerio') {
      this.modalContent = this.scenerioTemplate;
    } else if (type === 'harvest') {
      this.modalContent = this.harvestTemplate;
    } else if (type === 'misc') {
      this.modalContent = this.miscTemplate;
    }
  }

  startHarvest() {
    this.showModal = false;
    this.action = 'harvesting';
    this.db.object(`${this.divisionPath}/focus`).set('harvest');
  }

  onSelectionChange(selection) {
    this.divisionVote = selection;
  }

  closePolls() {
    this.db.object(`${this.divisionPath}/vote/state`).set('review');
  }

  onFundsChange(funds) {
    this.voteResultFunds = funds;
  }

  closeModal() {
    this.showModal = false;
    console.log("reset focus: ", focus);
    this.focusButtonsComponent.reset();
  }

  collectFunds() {
    each(this.divisionVote.vote.funds, (source) => {
      const sourceKey = source.key.split('-')[0];
      if (!source?.value) { return }
      if (sourceKey === 'reserve') {
        console.log("take from reserve: ", source, this.divisionVote.vote);
        this.bank.removeFromReserve(this.divisionPath, source.value)
      } else {
        const path = `${this.divisionPath}/citizens/${sourceKey}/resources`;
        console.log({path})
        this.bank.spendResources(path, source.value)
      }
    })
  };

  fundResolution() {
    const availableFunds = this.voteResultFunds;
    const requiredFunds = toNumber(this.divisionVote.selection.cost);

    let warning = null;

    if (availableFunds < requiredFunds) {
      warning = `Not enough funds to enact this resolution. Required funds: ${requiredFunds}. Provided funds: ${availableFunds}.`
    } else if (availableFunds > requiredFunds) {
      warning = `Warning: You are over-paying for this resolution. Extra funds will be added the reserve. Required funds: ${requiredFunds}. Provided funds: ${availableFunds}.`
    }
    return { 
      canEnact: availableFunds >= requiredFunds,
      warning
    }
  }

  implement() {
    let confirmed = false;
    if (this.divisionVote.vote.type === 'resolution') {
      const fundResolutionResult = this.fundResolution();
      if (!fundResolutionResult.canEnact) {
        alert(fundResolutionResult.warning);
      } else if (fundResolutionResult.warning) {
        confirmed = confirm(fundResolutionResult.warning);
      } else {
        confirmed = true;
      }
      if (confirmed) {
        this.collectFunds();
        this.setResolution();
      }
    } else if (this.divisionVote.vote.type === 'principle') {
      this.setPrinciple();
    } else if (this.divisionVote.vote.type === 'scenerio') {
      this.setScenerio();
    }
  }

  get voteReady() {
    return this.divisionVote !== undefined
  }

  setVoteDropdown(type) {
    console.log("set dropdown: ", type)
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.voteDropdown = null;
    this.voteDropdownSelect = null;
    
    if (type === 'resolutions') {
      this.db.list(`${divisionPath}/resolutions`)
        .valueChanges()
        .subscribe((resolutions) => {
          this.voteType = 'resolution';
          this.voteDropdown = differenceBy(this.globalResolutions, resolutions, 'title');
          console.log(resolutions, this.voteDropdown);
        });
    } else if (type === 'principles') {
      this.db.list(`${divisionPath}/principles`)
        .valueChanges()
        .subscribe((principles) => {
          console.log('principles: ', principles)
          this.voteType = 'principle';
          this.voteDropdown = differenceBy(this.globalPrinciples, principles, 'title');
          console.log(principles, this.voteDropdown);
        })
    } else if (type === 'scenerios') {
      this.db.list(`${divisionPath}/scenerios`)
        .valueChanges()
        .subscribe((scenerios) => {
          this.voteType = 'scenerio';
          this.voteDropdown = differenceBy(this.globalScenerios, scenerios, 'title');
          console.log(scenerios, this.voteDropdown);
        })
    }
  }

  setScenerio() {
    const scenerio = `${this.divisionVote.vote.result} ${this.divisionVote.selection.result}`;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: this.divisionVote.selection
    })

    this.db.list(`${this.divisionPath}/scenerios`).push({
      title: this.divisionVote.vote.title,
      value: scenerio
    })
  }

  setPrinciple() {
    const principle = `${this.divisionVote.vote.result} ${this.divisionVote.selection.result}`;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: this.divisionVote.selection
    })

    this.db.list(`${this.divisionPath}/principles`).push({
      title: this.divisionVote.vote.title,
      value: principle
    })
  }

  setResolution() {
    const resolution = `${this.divisionVote.vote.result} ${this.divisionVote.selection.result}`;
    const consequence = this.divisionVote.selection.consequence;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: this.divisionVote.selection
    })

    this.db.list(`${this.divisionPath}/resolutions`).push({
      title: this.divisionVote.vote.title,
      value: resolution,
      consequence, 
      cosequencesImplemented: false
    })

    this.db.list(`${this.divisionPath}/notifications`).push({
      header: "RESOLUTION",
      value: resolution,
      requiresAction: consequence,
      resolved: false,
      rejectable: false,
      sender: null
    })
  }

  clearVote() {
    this.divisionVote = null;
    this.action = 'resolution-review';
    this.db.object(`${this.divisionPath}/vote`).set(null);
  }

  submitChat(division) {
    if (!trim(this.chatInput)) return;

    console.log("SUBMIT: ", division, this.showKey, this.chatInput);
    this.db.list(`shows/${this.showKey}/feeds/${this.divisionKey}`)
      .push({ from: this.divisionKey, type: 'chat', value: this.chatInput })
      .then((res) => { 
        console.log('callback: ', res)
        this.chatInput = "";
      })
  }

  fontSizeUp() {
    if (this.fontSize + 2 < 100) {
      this.fontSize += 2;
    }
  }

  fontSizeDown() {
    if (this.fontSize - 2 > 0) {
      this.fontSize -= 2;
    }
  }

  newSeason(division) {
    console.log('new season for div: ', division)
    if (!division) return;
    const { season, capacity, extra, harvest } = division.nextSeason;
    this.harvest = this.generateHarvest(division.landTiles, division.nextSeason?.harvest);
    console.log("harvest: ", this.harvest)
    this.db.object(`${this.divisionPath}`).update({
      season, 
      capacity, 
      harvest,
      extra,
      landTiles: this.harvest,
      nextSeason: {
        ...division.nextSeason,
        season: season + 1
      },
      harvested: 0,
      selection: null
    })
    this.resetCitizenActions();
    // console.log('NEW HARVEST: ', this.harvest)
  }

  private async resetCitizenActions() {
    const citizens: any = await this.db.list(`${this.divisionPath}/citizens`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    console.log("reset... ", citizens)
    citizens.forEach((citizen, index) => {
      console.log('reset: ', citizen);
      this.db.object(`${this.divisionPath}/citizens/${index}`).update({
        actions: 2
      });
    })
  }

  private adjustContamination(level) {
    console.log('adjust contam')
    this.contamination = level;
    if (this.harvest) {
      const cardIndexes = this.harvest
        .map((tile, index) => tile.value == LandCardValues.EMPTY ? -1 : index)
        .filter(value => value !== -1);
      const contaminantsCount = Math.ceil((this.contamination / 100) * cardIndexes.length)
      const currentContaminantIndexes = this.harvest
        .map((tile, index) => tile.value === LandCardValues.CONTAM ? index : -1)
        .filter(value => value !== -1);
      const adjustment = contaminantsCount - currentContaminantIndexes.length;

      console.log({cardIndexes, contaminantsCount, current: currentContaminantIndexes.length, adjustment })
      if (adjustment > 0) {
        const contaminate = pluckRandom(
          difference(cardIndexes, currentContaminantIndexes),
          Math.min(adjustment, cardIndexes.length)
        );
        console.log('add contams: ', contaminate)
        contaminate.forEach((i) => {
          if (!this.harvest[i].harvested) {
            this.harvest[i].value = LandCardValues.CONTAM;
          }
        })
      } else if (adjustment < 0) {
        const uncontaminate = pluckRandom(currentContaminantIndexes, Math.min(Math.abs(adjustment), currentContaminantIndexes.length));
        console.log('Remove contams: ', uncontaminate)
        uncontaminate.forEach((i) => {
          if (!this.harvest[i].harvested) {
            this.harvest[i].value = getRandomInt(1,3);
          }
        })
      }
    }
  }

  private generateHarvest(landTiles, harvestableCards): Array<LandTile> {
    const tiles: LandTile[] = [ ...this.resetLandTiles(landTiles) ];
    const harvest: number[] = pluckRandom(range(tiles.length), harvestableCards);
    const contaminantsCount = Math.ceil((this.contamination / 100) * harvestableCards);
    const contaminants: number[] = pluckRandom(harvest, contaminantsCount);

    harvest.forEach((i) => {
      tiles[i].value = includes(contaminants, i) ? 0 : getRandomInt(1,3)
    })

    return tiles;
  }

  private resetLandTiles(tiles) {
    return tiles.map((tile) => ({
      ...tile,
      value: -1,
      contaminated: false,
      harvested: false
    }))
  }
}
