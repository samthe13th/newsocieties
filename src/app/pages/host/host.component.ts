import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { getRandomInt, pluckRandom } from 'src/app/utilties';
import { LandTile, LandCardValues } from 'src/app/interfaces';
import * as _ from 'lodash';
import { includes, difference, trim, differenceBy, toNumber, each, partition } from 'lodash';
import { take, map, tap } from 'rxjs/operators'
import { BankService } from 'src/app/services/bank.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ButtonGroupComponent } from 'src/app/components/button-group/button-group.component';
import { DivisionService } from 'src/app/services/division-service.service';
import { faPen, faGavel, faLandmark, faGlobe, faLeaf, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { NotificationType } from 'src/app/shared/types';
import { LandGridComponent } from 'src/app/components/land-grid/land-grid.component';
import * as fa from '@fortawesome/free-solid-svg-icons';

const DIVISIONS = ["N", "NE", "W", "NW", "E", "SW", "S", "SE"];

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
  @ViewChild('resolutionReviewTemplate') resolutionReviewTemplate: TemplateRef<any>;
  @ViewChild('scenerioTemplate') scenerioTemplate: TemplateRef<any>;
  @ViewChild('miscTemplate') miscTemplate: TemplateRef<any>;
  @ViewChild('newSeasonTemplate') newSeasonModal: TemplateRef<any>;
  
  @ViewChild('landGrid') landGrid: LandGridComponent;
  @ViewChild('focusButtonsComponent') focusButtonsComponent: ButtonGroupComponent;
  @ViewChild('updateSheet') updateSheet: TemplateRef<any>;
  @ViewChild('transferResourcesSheet') transferResourcesSheet: TemplateRef<any>;
  @ViewChild('addResourcesSheet') addResourcesSheet: TemplateRef<any>;
  @ViewChild('removeResourcesSheet') removeResourcesSheet: TemplateRef<any>;
  @ViewChild('changeResourcesSheet') changeResourcesSheet: TemplateRef<any>;
  @ViewChild('changeAdvancementSheet') changeAdvancementSheet: TemplateRef<any>;
  @ViewChild('advancementSheet') advancementSheet: TemplateRef<any>;
  @ViewChild('localLandSheet') localLandSheet: TemplateRef<any>;
  
  modalContent: TemplateRef<any>;

  // ICONS
  faPen = faPen;
  fa = fa;

  showModal = false;

  focusButtons = [
    { id: 'harvest', label: 'Harvest', faIcon: faLeaf },
    { id: 'principles', label: 'Principle', faIcon: faLandmark },
    { id: 'resolutions', label: 'Resolution', faIcon: faGavel },
    { id: 'scenerio', label: 'Scenerio', faIcon: faGlobe },
    { id: 'misc', label: 'Market', faIcon: faCartPlus },
  ]

  resourceType = 3;
  resourceTypes = [
    { id: '3', label: '3' },
    { id: '2', label: '2' },
    { id: '1', label: '1'}
  ]

  $vote;
  $division;
  $citizens;
  $resolutions;
  $principles;
  $scenerios;
  $turn;
  $focus;
  $unseenNotifications;
  $unseenChat;
  $citizenAdvancements;
  $pendingGLA;
  $localLand;
  $globalLand;
  $turnButtons;
  $lastResolution;

  selectedCitizen;
  changeAttribute;
  changeListAttribute;

  divisions;
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
  rightTab;
  leftTab;
  citizenCount = 0;
  positions;


  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private bank: BankService,
    private bottomSheet: MatBottomSheet,
    private divisionService: DivisionService,
    public bankService: BankService
  ) {}

  ngOnInit() {
    this.divisionKey = this.route.snapshot.params.division;
    this.showKey = this.route.snapshot.params.show;
    this.divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    console.log('division path: ', this.divisionPath)
    
    this.landTilesPath = `${this.divisionPath}/landTiles`;

    this.$vote = this.db.object(`${this.divisionPath}/vote`).valueChanges();
    this.$division = this.db.object(this.divisionPath).valueChanges();
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        tap((citizens) => {
          if (this.citizenCount !== citizens.length) {
            this.updatePositions();
          }
          this.citizenCount = citizens.length;
      })
    )
    this.$lastResolution = this.db.object(`${this.divisionPath}/lastResolution`).valueChanges()
    this.$resolutions = this.db.list(`${this.divisionPath}/resolutions`).valueChanges();
    this.$principles = this.db.list(`${this.divisionPath}/principles`).valueChanges();
    this.$scenerios = this.db.list(`${this.divisionPath}/scenerios`).valueChanges();
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges();
    this.$pendingGLA = this.db.list(`${this.divisionPath}/pendingGLA`).valueChanges();
    this.$localLand = this.db.list(`${this.divisionPath}/localLand`).valueChanges();
    this.$globalLand = this.db.list(`${this.divisionPath}/globalLand`).valueChanges();
    this.$unseenNotifications = this.db.list(`${this.divisionPath}/unseenNotifications`).valueChanges();
    this.$unseenChat = this.db.object(`${this.divisionPath}/unseenChat`).valueChanges();
    this.$turnButtons = this.db.list(`${this.divisionPath}/citizens`)
      .valueChanges()
      .pipe(
        map((citizens: any) => citizens.map((c, index) => ({ id: c.id, label: index + 1 })))
      )
    this.$focus.subscribe((focus) => {
      console.log({focus})
      this.focus = focus;
    })

    this.db.object(`shows/${this.showKey}`)
    .valueChanges()
    .pipe(take(1))
    .subscribe((show) => {
      this.divisions = this.getDivisionObservables(show);
    })

    this.divisionService.calculateDivisionScore$(this.showKey, this.divisionKey).subscribe();
    this.divisionService.thresholdListener$(this.showKey, this.divisionKey).subscribe();

    this.db.object(`shows/${this.showKey}/contamination/current`)
      .valueChanges()
      .subscribe((level) => {
        this.adjustContamination(level);
      })

    this.getResolutions();
    this.getPrinciples();
    this.getScenerios();
  }

  async updatePositions() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    const citizens = await this.db.list(`${divisionPath}/citizens`).valueChanges().pipe(
      take(1)
    ).toPromise();
    console.log('UPDATE POSITIONS: ', {citizens});
    this.positions = citizens.map((c: any) => c?.id);
    this.db.object(`${divisionPath}/positions`).set(this.positions);
  }

  onAttributeUpdate(value) {
    this.actionSheet.dismiss();
    console.log('on update: ', value)
  }

  calculateWealth(resources) {
    if (!resources) return 0;
    return resources.reduce((acc, R) => acc + R.value, 0);
  }

  exploreOwnedLand(landGrid) {
    landGrid.exploreOwnedLand();
  }

  gatherOwnedLand(landGrid) {
    landGrid.gatherOwnedLand();
  }

  onRightTabChange(tab) {
    console.log("tab: ", tab)
    this.rightTab = tab.id;
    if (this.rightTab === 'notifications' || tab.id === 'notifications') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenNotifications`).remove();
    }
  }

  async onLeftTabChange(tab) {
    console.log('tab: ', tab, this.leftTab, this.leftTab === 'central' || tab?.id === 'central')
    if (this.leftTab === 'central' || tab.id === 'central') {
      console.log('CLEAR THIS')
      await this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenChat`).set(0)
    }
    this.leftTab = tab.id;
  }

  updateCitizenLand(citizen, landCost) {
    this.selectedCitizen = citizen;
    this.changeAttribute = {
      name: 'Land',
      data: {
        wealth: this.bankService.calculateWealth(citizen.resources),
        cost: landCost
      },
      dbPath: `${this.divisionPath}/citizens/${citizen.id}/land`
    };
    this.actionSheet = this.bottomSheet.open(this.localLandSheet);
  }

  updateAdvancement(adv, citizen, advancementCosts) {
    this.selectedCitizen = citizen;
    this.changeAttribute = {
      name: adv,
      data: {
        wealth: this.bankService.calculateWealth(citizen.resources),
        cost: advancementCosts[Math.min(citizen.advancements[adv], 2)]
      },
      dbPath: `${this.divisionPath}/citizens/${citizen.id}/advancements/${adv}`
    }
    console.log('change attr: ', this.changeAttribute)
    this.actionSheet = this.bottomSheet.open(this.advancementSheet);
  }

  async buyAdvancement(advancement, price, updatePath) {
    console.log({advancement, price, updatePath})
    if (advancement > 3 || !this.selectedCitizen?.id) return;
    const wealth = this.bankService.calculateWealth(this.selectedCitizen.resources);
    console.log({wealth, price})
    if (wealth >= price) {
      this.db.object(updatePath).query.ref.transaction(adv => ++adv ?? 1)
      this.bankService.spendResources(this.showKey, this.divisionKey, this.selectedCitizen?.id, price);
      console.log('buy advancement: ', advancement, this.selectedCitizen, price, wealth);
    }
    const individualPath = `${this.divisionPath}/advancements/${advancement}/individual`;
    await this.db.object(individualPath).query.ref.transaction((ind) => ind ? ind + 1 : 1)

    this.actionSheet.dismiss();
  }

  buyLocalLand(price, updatePath) {
    console.log('buy local land: ', this.selectedCitizen, price)
    this.bankService.spendResources(
      this.showKey,
      this.divisionKey,
      this.selectedCitizen.id,
      price
    ).then(() => {
      this.divisionService.acquireLand(this.showKey, this.divisionKey, [{
        division: this.divisionKey,
        id: this.selectedCitizen.id,
        name: this.positions.indexOf(this.selectedCitizen.id) + 1
      }]);
      this.actionSheet.dismiss();
    })
  }

  async onGather(tile) {
    if (tile.value > 0) {
      this.bank.depositResources(
        this.showKey,
        tile.owner.division,
        tile.owner.id, [{
        value: tile.value,
        division: tile.owner.division
      }]).then(() => {
        console.log('deposited')
      })
    }
  }

  changeDivisionProperty(prop, name=null) {
    this.changeAttribute = {
      name: name ?? prop,
      dbPath: `${this.divisionPath}/${prop}`
    }
    this.actionSheet = this.bottomSheet.open(this.updateSheet);
  }

  changeCitizenProperty(citizen, prop, type, name=null) {
    console.log('change: ', citizen, prop, type, name)
    this.selectedCitizen = citizen;
    this.changeAttribute = {
      name: name ?? prop,
      dbPath: `${this.divisionPath}/citizens/${citizen.id}/${prop}`
    }
    this.actionSheet = (type === 'advancement') 
      ? this.bottomSheet.open(this.changeAdvancementSheet)
      : this.bottomSheet.open(this.updateSheet)
  }

  percentHarvested(harvested, capacity) {
    return Math.round((toNumber(harvested)/toNumber(capacity)) * 100)
  }

  async onAdvancementUpdate(newVal, prop) {
    const individualPath = `${this.divisionPath}/advancements/${prop}/individual`;
    const value = newVal - this.selectedCitizen.advancements[prop];
    await this.db.object(individualPath).query.ref.transaction((ind) => ind ? ind + value : value)
    this.db.object(this.changeAttribute.dbPath).set(newVal);
    this.actionSheet.dismiss();
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
      .set({ id: button.id })
  }

  onFocusSelect(button) {
    console.log('focus select: ', button);
    this.setFocus(button.id);
  }

  startVote(focus) {
    this.db.object(`${this.divisionPath}/focus`).set(focus);
    console.log('start vote: ', this.voteDropdownSelect)
    this.showModal = false;
    this.action = 'voting';
    
    this.db.object(`${this.divisionPath}/vote`).set({
      type: this.voteType,
      ...this.voteDropdownSelect,
      state: 'voting',
      voted: "[]"
    })
  }

  newResolution() {
    this.setVoteDropdown('resolutions');
    this.modalContent = this.resolutionTemplate;
    this.showModal = true;
  }

  async setFocus(type) {
    const lastResolution = await this.db.object(`${this.divisionPath}/lastResolution`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    if (type === 'principles') {
      this.setVoteDropdown('principles');
      this.modalContent = this.principleTemplate;
    } else if (type === 'resolutions') {
      if (lastResolution) {
        this.modalContent = this.resolutionReviewTemplate;
      } else {
        this.setVoteDropdown('resolutions');
        this.modalContent = this.resolutionTemplate;
      }
    } else if (type === 'scenerio') {
      this.setVoteDropdown('scenerios');
      this.modalContent = this.scenerioTemplate;
    } else if (type === 'harvest') {
      this.modalContent = this.harvestTemplate;
    } else if (type === 'misc') {
      this.modalContent = this.miscTemplate;
    }
    this.showModal = true;
  }

  startHarvest() {
    this.showModal = false;
    this.action = 'harvesting';
    this.db.object(`${this.divisionPath}/focus`).set('harvest');
  }

  startMisc() {
    this.showModal = false;
    this.db.object(`${this.divisionPath}/focus`).set('misc');
  }

  onSelectionChange(selection) {
    this.divisionVote = selection;
  }

  closePolls() {
    this.divisionVote = undefined;
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
        this.bank.spendResources(this.showKey, this.divisionKey, sourceKey, source.value)
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
      this.setResolution();
      // const fundResolutionResult = this.fundResolution();
      // if (!fundResolutionResult.canEnact) {
      //   alert(fundResolutionResult.warning);
      // } else if (fundResolutionResult.warning) {
      //   confirmed = confirm(fundResolutionResult.warning);
      // } else {
      //   confirmed = true;
      // }
      // if (confirmed) {
      //   this.collectFunds();
      //   this.setResolution();
      // }
    } else if (this.divisionVote.vote.type === 'principle') {
      this.setPrinciple();
    } else if (this.divisionVote.vote.type === 'scenerio') {
      this.setScenerio();
    }
  }

  reviewLastResolution() {
    this.db.object(`${this.divisionPath}/focus`).set('resolutionReview');
    this.showModal = false;
  }

  get voteReady() {
    return this.divisionVote !== undefined
  }

  changeCitizenResources(citizen) {
    console.log("change resources: ", citizen);
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.changeResourcesSheet);
  }

  removeCitizenResources(citizen) {
    console.log("remove resources: ", citizen);
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.removeResourcesSheet);
  }

  addCitizenResources(citizen) {
    console.log("add resources: ", citizen);
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.addResourcesSheet);
  }

  transferCitizenResources(citizen) {
    console.log('transfer ', citizen);
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.transferResourcesSheet);
  }

  transferResources(to, amount) {
    if (to === 'reserve') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`)
        .query.ref.transaction(reserve => reserve + amount ?? amount)
    }
    this.bankService.spendResources(this.showKey, this.divisionKey, this.selectedCitizen?.id, amount).then(() => {
      this.actionSheet.dismiss();
    })
  }

  setVoteDropdown(type) {
    console.log("set dropdown: ", type)
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.voteDropdown = null;
    this.voteDropdownSelect = null;
    
    if (type === 'resolutions') {
      this.db.list(`${divisionPath}/resolutions`)
        .valueChanges()
        .pipe(take(1))
        .subscribe((resolutions) => {
          this.voteType = 'resolution';
          this.voteDropdown = differenceBy(this.globalResolutions, resolutions, 'title');
          console.log(resolutions, this.voteDropdown);
        });
    } else if (type === 'principles') {
      this.db.list(`${divisionPath}/principles`)
        .valueChanges()
        .pipe(take(1))
        .subscribe((principles) => {
          console.log('principles: ', principles)
          this.voteType = 'principle';
          this.voteDropdown = differenceBy(this.globalPrinciples, principles, 'title');
          console.log(principles, this.voteDropdown);
        })
    } else if (type === 'scenerios') {
      this.db.list(`${divisionPath}/scenerios`)
        .valueChanges()
        .pipe(take(1))
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
    const resolutionData = {
      title: this.divisionVote.vote.title,
      value: resolution,
      consequence, 
      cosequencesImplemented: false
    }

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: this.divisionVote.selection
    })
    this.db.object(`${this.divisionPath}/lastResolution`).set(resolutionData)
    this.db.list(`${this.divisionPath}/resolutions`).push(resolutionData)
    this.db.list(`${this.divisionPath}/notifications`).push({
      type: NotificationType.resolution,
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
    this.db.object(`shows/${this.showKey}/centralUnseen/${division}`).query.ref.transaction(
      (unseen) => unseen ? ++unseen : 1
    )
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

  removeResources(amount) {
    this.bankService.spendResources(
      this.showKey,
      this.divisionKey,
      this.selectedCitizen.id,
      amount
    ).then(() => {
      this.actionSheet.dismiss();
    })
  }

  changeResources(value) {
    const wealth = this.bankService.calculateWealth(this.selectedCitizen.resources);
    console.log('change R: ', wealth, value);
    if (value > wealth) {
      this.addResources(value - wealth);
    } else if (value < wealth) {
      this.removeResources(wealth - value);
    } else {
      this.actionSheet.dismiss();
    }
  }

  addResources(amount) {
    this.bankService.depositResources(
      this.showKey,
      this.divisionKey,
      this.selectedCitizen.id,
      this.bankService.quickConvert(this.divisionKey, amount)
    ).then(() => {
      this.actionSheet.dismiss();
    })
  }

  onResourceTypeSelect(x) {
    console.log({x})
    this.resourceType = toNumber(x?.id);
    console.log(this.resourceType, typeof this.resourceType)
  }

  async startSeason(division, newSeason) {
    const landTiles = await this.divisionService.setLandTiles(this.showKey, this.divisionKey)
    this.harvest = this.generateHarvest(landTiles, newSeason?.harvest);

    this.db.object(`${this.divisionPath}`).update({
      season: newSeason.season,
      capacity: newSeason.capacity,
      harvest: newSeason.harvest,
      highThresholdMet: false,
      reserveThresholds: {
        low: newSeason.thresholds[0],
        mid: newSeason.thresholds[1],
        high: newSeason.thresholds[2]
      },
      landCost: newSeason.landCost,
      landTiles: this.harvest,
      harvested: 0,
      selection: null
    })
    this.resetCitizenActions();
    this.showModal = false;
    console.log('NEW HARVEST: ', this.harvest)
  }

  newSeason(division) {
    if (!division) return;
    this.divisionService.newSeason(this.showKey, this.divisionKey);
    this.modalContent = this.newSeasonModal;
    this.showModal = true;
  }

  getDivisionObservables(show) {
    if (show?.divisions) {
      const divisions = Object.keys(show.divisions).reduce((acc, code) => ({ 
        ...acc,
        [code]: this.db.object(`shows/${this.showKey}/divisions/${code}`).valueChanges()
      }), {});

      const listeners = {
        C: this.db.object(`shows/${this.showKey}/global`).valueChanges(),
        ...divisions,
      }

      console.log({listeners})

      return DIVISIONS.map((code) => listeners[code]
        ? { code, listener: listeners[code] }
        : { code }
      );
    }

    return []
  }

  private async resetCitizenActions() {
    const citizens: any = await this.db.list(`${this.divisionPath}/citizens`)
      .valueChanges()
      .pipe(take(1))
      .toPromise();

    citizens.forEach((citizen) => {
      this.db.object(`${this.divisionPath}/citizens/${citizen.id}`).update({
        actions: 2
      });
    })

    this.db.object(`${this.divisionPath}/turn`).set({
      id: citizens[0].id
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
    const [owned, open]: LandTile[][] = partition(tiles, (tile) => tile.owner !== undefined);
    const harvestableCount = harvestableCards - owned.length;
    const harvestIndexes = [
      ...owned.map((tile: any) => tile.index),
      ...pluckRandom(open.map((tile: any) => tile.index), harvestableCount > 0 ? harvestableCount : 0)
    ]
    const contaminantsCount = Math.ceil((this.contamination / 100) * harvestableCards);
    const contaminants: number[] = pluckRandom(harvestIndexes, contaminantsCount);

    harvestIndexes.forEach((i) => {
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
