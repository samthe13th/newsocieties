import { Component, HostListener, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { getRandomInt, pluckRandom } from 'src/app/utilties';
import { LandTile, LandCardTypes } from 'src/app/interfaces';
import * as _ from 'lodash';
import { isNumber, includes, trim, find, differenceBy, toNumber, each, partition } from 'lodash';
import { take, map, tap, filter } from 'rxjs/operators'
import { Subject, combineLatest } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ButtonGroupComponent } from 'src/app/components/button-group/button-group.component';
import { DivisionService } from 'src/app/services/division-service.service';
import { faPen, faGavel, faScroll, faLandmark, faBullseye, faEyeSlash, faGlobe, faLeaf, faCartPlus, faEye, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
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
export class HostComponent implements OnInit, OnDestroy {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const numberKey = toNumber(event.key);
    if (this.hostAction === 'harvest') {
      if (this.actionSheet === undefined && this.positions[numberKey - 1]) {
        this.onTurnSelect(this.positions[numberKey - 1])
      }
      if (this.hostAction === 'harvest' && event.key === 'e') {
        this.explore();
      }
      if (this.hostAction === 'harvest' && event.key === 'g') {
        this.gather();
      }
    }
  }

  @ViewChild('harvestTemplate') harvestTemplate: TemplateRef<any>;
  @ViewChild('principleTemplate') principleTemplate: TemplateRef<any>;
  @ViewChild('resolutionTemplate') resolutionTemplate: TemplateRef<any>;
  @ViewChild('resolutionReviewTemplate') resolutionReviewTemplate: TemplateRef<any>;
  @ViewChild('scenarioTemplate') scenarioTemplate: TemplateRef<any>;
  @ViewChild('miscTemplate') miscTemplate: TemplateRef<any>;
  @ViewChild('reviewTemplate') reviewTemplate: TemplateRef<any>;
  @ViewChild('newSeasonTemplate') newSeasonModal: TemplateRef<any>;
  @ViewChild('customVoteTemplate') customVoteTemplate: TemplateRef<any>;
  
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
  @ViewChild('disableColumnsSheet') disableColumnsSheet: TemplateRef<any>;

  @ViewChild('harvestTileSheet', { static: false }) harvestTileSheet: TemplateRef<any>;
  
  modalContent: TemplateRef<any>;

  // ICONS
  faPen = faPen;
  fa = fa;
  exploreIcon = faEye;
  gatherIcon = faShoppingBag;
  visibleIcon = faEyeSlash;
  highlightIcon = faBullseye;

  showModal = false;

  focusButtons = [
    { id: 'harvest', label: 'Harvest', faIcon: faLeaf },
    { id: 'principles', label: 'Principle', faIcon: faLandmark },
    { id: 'resolutions', label: 'Resolution', faIcon: faGavel },
    { id: 'scenario', label: 'Scenario', faIcon: faGlobe },
    { id: 'misc', label: 'Market', faIcon: faCartPlus },
    { id: 'review', label: 'Review', faIcon: faScroll }
  ]

  divisionButtons = DIVISIONS.map(d => ({
    id: d,
    label: d
  }))

  disableHarvestColumnButtons = []

  resourceType = 3;
  resourceTypes = [
    { id: '3', label: '3' },
    { id: '2', label: '2' },
    { id: '1', label: '1'}
  ]

  visibleDataButtons = [
    { id: 'visible', faIcon: this.visibleIcon },
    { id: 'highlight', faIcon: this.highlightIcon },
  ]

  private destroy$ = new Subject<boolean>();
  
  $vote;
  $division;
  $citizens;
  $capacity;
  $resolutions;
  $principles;
  $scenarios;
  $turn;
  $focus;
  $unseenNotifications;
  $unseenChat;
  $unseenNews;
  $citizenAdvancements;
  $pendingGLA;
  $localLand;
  $globalLand;
  $turnButtons;
  $lastResolution;
  $exports;
  $actions;
  $playerView;
  $overlay;
  $pageState;

  customVoteInput;
  voteState;
  selectedCitizen;
  selectedLandTile;
  changeAttribute;
  changeListAttribute;
  hostAction;
  divisions;
  actionSheet;
  voteResultFunds = 0;
  division;
  contamination;
  harvest;
  divisionColor;
  divisionKey;
  showKey;
  divisionPath;
  landTilesPath;
  chatInput = "";
  focus = 'none';
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
  globalScenarios;
  voteDropdown;
  voteDropdownSelect;
  rightTab;
  leftTab;
  citizenCount = 0;
  citizens;
  positions;
  lockColumns;


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
    this.landTilesPath = `${this.divisionPath}/landTiles`;
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/color`).valueChanges()
      .pipe(take(1)).subscribe((color) =>{
        this.divisionColor = color;
      })

    this.$pageState = this.db.object(`${this.divisionPath}/focus`).valueChanges()
      .pipe(
        map(focus => focus !== 'new-season' ? 'main' : 'newSeason')
      )
    this.$vote = this.db.object(`${this.divisionPath}/vote`).valueChanges().pipe(
      tap((vote: any) => { console.log('VOTE: ', vote); this.voteState = vote?.state })
    )
    this.$division = this.db.object(this.divisionPath).valueChanges().pipe(
      filter((x) => x !== null && x !== undefined)
    );
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        tap((citizens) => {
          if (this.citizenCount !== citizens.length) {
            this.updatePositions();
            this.citizens = citizens;
          }
          this.citizenCount = citizens.length;
      })
    )
    this.$actions = this.db.object(`${this.divisionPath}/actions`).valueChanges();
    this.$capacity = this.db.object(`${this.divisionPath}/capacity`).valueChanges();
    this.$exports = this.db.list(`${this.divisionPath}/exports`).valueChanges().pipe(map((exports) => exports.reverse()));
    this.$lastResolution = this.db.object(`${this.divisionPath}/lastResolution`).valueChanges()
    this.$resolutions = this.db.list(`${this.divisionPath}/resolutions`).valueChanges();
    this.$principles = this.db.list(`${this.divisionPath}/principles`).valueChanges();
    this.$scenarios = this.db.list(`${this.divisionPath}/scenarios`).valueChanges();
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges();
    this.$pendingGLA = this.db.list(`${this.divisionPath}/pendingGLA`).valueChanges();
    this.$localLand = this.db.list(`${this.divisionPath}/localLand`).valueChanges();
    this.$globalLand = this.db.list(`${this.divisionPath}/globalLand`).valueChanges();
    this.$unseenNotifications = this.db.list(`${this.divisionPath}/unseenNotifications`).valueChanges();
    this.$unseenChat = this.db.object(`${this.divisionPath}/unseenChat`).valueChanges();
    this.$unseenNews = this.db.object(`${this.divisionPath}/unseenNews`).valueChanges();
    this.$turnButtons = this.db.list(`${this.divisionPath}/citizens`)
      .valueChanges()
      .pipe(
        map((citizens: any) => citizens.map((c, index) => ({ id: c.id, label: index + 1 })))
      )
    this.$focus.subscribe((focus) => {
      this.focus = focus;
    })
    this.$playerView = combineLatest(
      this.db.object(`${this.divisionPath}/playerViewHighlight`).valueChanges(),
      this.db.object(`${this.divisionPath}/playerViews`).valueChanges()
    ).pipe(
      map(([highlight, views]) => ({highlight, views}))
    )

    this.db.object(`shows/${this.showKey}`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((show) => {
        this.divisions = this.getDivisionObservables(show);
      })

    this.divisionService.calculateDivisionScore$(this.showKey, this.divisionKey).subscribe();
    // this.divisionService.thresholdListener$(this.showKey, this.divisionKey).subscribe();

    this.db.object(`shows/${this.showKey}/contamination/current`)
      .valueChanges()
      .subscribe((level) => {
        this.contamination = level;
      })

    this.getResolutions();
    this.getPrinciples();
    this.getScenarios();
  }

  async updatePositions() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    const citizens = await this.db.list(`${divisionPath}/citizens`).valueChanges().pipe(
      take(1)
    ).toPromise();
    this.positions = citizens.map((c: any) => c?.id);
    this.db.object(`${divisionPath}/positions`).set(this.positions);
  }

  onPlayerDataButtonClick(component, property) {
    console.log("click: ", component, property);
    if (property === 'visible') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViews/${component}`)
        .query.ref.transaction(value => value ? !value : true)
    } else if (property === 'highlight') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViewHighlight`)
        .query.ref.transaction(value => component !== value ? component : null)
    }
  }

  safeGather() {
    this.hostAction = undefined;
    this.landGrid.gather(this.selectedLandTile, this.selectedCitizen?.id, true);
    this.dismissSheet();
  }

  gather() {
    this.hostAction = undefined;
    this.landGrid.gather(this.selectedLandTile, this.selectedCitizen?.id);
    this.dismissSheet();
  }

  safeExplore() {
    this.hostAction = undefined;
    this.landGrid.explore(this.selectedLandTile, this.selectedCitizen?.id, true);
    this.dismissSheet();
  }

  explore() {
    this.hostAction = undefined;
    this.landGrid.explore(this.selectedLandTile, this.selectedCitizen?.id);
    this.dismissSheet();
  }

  dismissSheet() {
    this.actionSheet.dismiss();
    this.actionSheet = undefined;
  }

  onSelectLandTile(tile) {
    this.selectedLandTile = tile;
    this.hostAction = 'harvest';
    this.actionSheet = this.bottomSheet.open(this.harvestTileSheet);
  }

  onAttributeUpdate(value) {
    this.dismissSheet();
  }

  calculateWealth(resources) {
    if (!resources) return 0;
    return resources.reduce((acc, R) => acc + R.value, 0);
  }

  exploreOwnedLand(landGrid) {
    landGrid.exploreOwnedLand();
  }

  gatherGLA(landGrid) {
    landGrid.gatherGLA();
  }

  disableColumns() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/harvestColumn`).valueChanges()
      .pipe(take(1))
      .subscribe((columns: any) => {
        this.disableHarvestColumnButtons = columns.map((showColumn, i) => ({ label: i, value: showColumn }))
      })
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/lockHarvestColumns`).valueChanges()
      .pipe(take(1))
      .subscribe((lock: boolean) => {
        this.lockColumns = lock ?? false
      })
    this.actionSheet = this.bottomSheet.open(this.disableColumnsSheet);
  }

  toggleLockColumnsStatus() {
    setTimeout(() => {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/lockHarvestColumns`).set(
        this.lockColumns ?? false
      )
    })
  }

  onRightTabChange(tab) {
    console.log('tab change: ', tab, this.rightTab);
    if (this.rightTab === 'notifications' || tab.id === 'notifications') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenNotifications`).remove();
    }
    
    if (this.rightTab === 'news' || tab.id === 'news') {
      console.log('clear unseen news')
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenNews`).remove();
    }
    this.rightTab = tab.id;
  }

  async onLeftTabChange(tab) {
    if (this.leftTab === 'central' || tab.id === 'central') {
      await this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenChat`).set(0)
    }
    this.leftTab = tab.id;
  }

  onHarvestColumnSelect(select) {
    console.log('select: ', select)
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
    this.actionSheet = this.bottomSheet.open(this.advancementSheet);
  }

  async buyAdvancement(advancement, price, updatePath) {
    console.log('buy adv for ', this.selectedCitizen?.name)
    if (advancement > 3 || !this.selectedCitizen?.id) return;
    const wealth = this.bankService.calculateWealth(this.selectedCitizen.resources);
    if (wealth >= price) {
      this.db.object(updatePath).query.ref.transaction(adv => ++adv ?? 1)
      this.bankService.spendResources(this.showKey, this.divisionKey, this.selectedCitizen?.id, price);
    }
    const individualPath = `${this.divisionPath}/advancements/${advancement}/individual`;
    await this.db.object(individualPath).query.ref.transaction((ind) => ind ? ind + 1 : 1)

    this.dismissSheet();
  }

  buyLocalLand(price, updatePath) {
    const citizen = this.selectedCitizen;
    console.log("buy land for ", citizen?.id)
    this.bankService.spendResources(
      this.showKey,
      this.divisionKey,
      citizen?.id,
      price
    ).then(() => {
      this.divisionService.acquireLand(this.showKey, this.divisionKey, [{
        division: this.divisionKey,
        id: citizen?.id,
        color: this.divisionColor,
        name: this.positions.indexOf(citizen?.id) + 1
      }]).then(() => {
        // this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).set({
        //   header: `${citizen?.name} acquired a new plot of land!`,
        // })
      });
      this.dismissSheet();
    })
  }

  notLocal(tile) {
    return tile.owner && tile.owner?.division !== this.divisionKey
  }
  
  async onGather({ tile, playerId, safe }) {
    const id = this.notLocal(tile) ? tile.owner?.id : playerId
    const divisionKey = tile.owner?.division ?? this.divisionKey;
    const tileValue = tile.value;

    if (tile.type === LandCardTypes.C) {
      const contaminateCallback = safe ? "Thankfully, no resources were destroyed"
        : await this.divisionService.contaminateResources(
        this.showKey, this.divisionKey, this.selectedCitizen?.id
      );
      console.log('contam: ', tileValue, tile.value)
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).set({
        tile: tile.index,
        type: LandCardTypes.C,
        header: `${this.selectedCitizen?.name} gathered a contaminant!`,
        message: contaminateCallback,
        value: tileValue,
        duration: 2500
      })
    } else if (tile.value && id && divisionKey) {
      this.bank.depositResources(
        this.showKey,
        divisionKey,
        id, [{
        value: tile.value,
        division: divisionKey
      }]).then(() => {
        if (!this.notLocal(tile) && this.selectedCitizen) {
          console.log("push new popup")
          this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).set({
            tile: tile.index,
            type: LandCardTypes.R,
            header: `${this.selectedCitizen?.name} gathered a resource`,
            value: tileValue
          })
        }
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
    this.selectedCitizen = citizen;
    this.changeAttribute = {
      name: name ?? prop,
      dbPath: `${this.divisionPath}/citizens/${citizen.id}/${prop}`
    }
    this.actionSheet = (type === 'advancement') 
      ? this.bottomSheet.open(this.changeAdvancementSheet)
      : this.bottomSheet.open(this.updateSheet)
  }

  capacityUsed(actions, capacity) {
    const actionsTotal = toNumber(actions);
    const capacityTotal = toNumber(capacity);
    return actionsTotal
      ? Math.round((actionsTotal/capacityTotal) * 100)
      : capacityTotal
  }

  async onAdvancementUpdate(newVal, prop) {
    const individualPath = `${this.divisionPath}/advancements/${prop}/individual`;
    const value = newVal - this.selectedCitizen.advancements[prop];
    await this.db.object(individualPath).query.ref.transaction((ind) => ind ? ind + value : value)
    this.db.object(this.changeAttribute.dbPath).set(newVal);
    this.dismissSheet();
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
        this.globalPrinciples = principles
      });
  }

  getScenarios() {
    this.db.list(`scenarios`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((scenarios) => {
        this.globalScenarios = scenarios
      });
  }

  onTurnSelect(id) {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/turn`)
      .set(id)
    // this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).set({
    //   message: `It is now ${this.selectedCitizen.name}'s turn!`,
    //   duration: 2000
    // })
  }

  onFocusSelect(button) {
    this.setFocus(button.id);
  }

  onTurnChange(citizen) {
    this.selectedCitizen = citizen;
    this.clearSelection();
  }

  clearSelection() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/selection`).remove();
  }

  autoPick(focus) {
    const untouched = this.voteDropdown.filter((option) => !option.noDecision);
    console.log('untouched: ', untouched)
    this.voteDropdownSelect = pluckRandom(untouched, 1)[0];
    this.startVote(focus)
  }

  startVote(focus) {
    this.db.object(`${this.divisionPath}/focus`).set(focus);
    this.showModal = false;
    this.action = 'voting';
    
    setTimeout(() => {
      this.db.object(`${this.divisionPath}/vote`).set({
        type: this.voteType,
        ...this.voteDropdownSelect,
        state: 'voting',
        voted: "[]"
      })
    }, 1000)
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

  toggleColumnDisabledState(i) {
    const button = this.disableHarvestColumnButtons[i];
    button.value = !button.value;
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/harvestColumn/${i}`)
      .query.ref.transaction((show) => show == null ? false : !show)
  }

  startHarvest() {
    this.showModal = false;
    this.action = 'harvesting';
    this.db.object(`${this.divisionPath}/focus`).set('harvest');
  }

  setReviewDivision(division) {
    console.log("set....", division)
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionReview`).set(division?.id);
  }

  startMisc() {
    this.showModal = false;
    this.db.object(`${this.divisionPath}/focus`).set('misc');
  }

  startReview() {
    this.showModal = false;
    this.db.object(`${this.divisionPath}/focus`).set('review');
  }

  onSelectionChange(selection) {
    this.divisionVote = selection;
  }

  onVoteChange(vote) {
    this.divisionVote = { selection: undefined, vote };
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
    this.focusButtonsComponent.reset();
  }

  collectFunds() {
    each(this.divisionVote.vote.funds, (source) => {
      const sourceKey = source.key.split('-')[0];
      if (!source?.value) { return }
      if (sourceKey === 'reserve') {
        this.bank.removeFromReserve(this.divisionPath, source.value)
      } else {
        const path = `${this.divisionPath}/citizens/${sourceKey}/resources`;
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

  noDecision() {
    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      noDecision: true,
    });
    this.db.list(`${this.divisionPath}/undecided-principles`).push({
      title: this.divisionVote.vote.title,
      value: 'No decision',
      noDecision: true
    });
  }

  customVoteOption() {
    console.log('custom vote: ', this.divisionVote)
    this.modalContent = this.customVoteTemplate;
    this.showModal = true;
  }

  implement(customVote=null) {
    const selection = customVote
      ? { result: customVote }
      : this.divisionVote.selection;
    console.log("IMPLEMENT: ", selection)
    if (!this.divisionVote) return;
    if (this.divisionVote.vote.type === 'resolution') {
      this.setResolution(selection);
    } else if (this.divisionVote.vote.type === 'principle') {
      this.setPrinciple(selection);
    } else if (this.divisionVote.vote.type === 'scenario') {
      this.setScenario(selection);
    }
    this.showModal = false;
  }

  reviewLastResolution() {
    this.db.object(`${this.divisionPath}/focus`).set('resolutionReview');
    this.showModal = false;
  }

  get voteReady() {
    return this.divisionVote !== undefined
  }

  changeCitizenResources(citizen) {
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.changeResourcesSheet);
  }

  removeCitizenResources(citizen) {
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.removeResourcesSheet);
  }

  addCitizenResources(citizen) {
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.addResourcesSheet);
  }

  removeCitizen(id) {
    if (confirm('Are you sure you want to remove this citizen?')) {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens/${id}`).remove();
    }
  }

  transferCitizenResources(citizen) {
    this.selectedCitizen = citizen;
    this.actionSheet = this.bottomSheet.open(this.transferResourcesSheet);
  }

  transferResources(to, amount) {
    if (to === 'reserve') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`)
        .query.ref.transaction(reserve => reserve + amount ?? amount)
    }
    this.bankService.spendResources(this.showKey, this.divisionKey, this.selectedCitizen?.id, amount).then(() => {
      this.dismissSheet();
    })
  }

  setVoteDropdown(type) {
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
        });
    } else if (type === 'principles') {

      combineLatest(
        this.db.list(`${divisionPath}/principles`).valueChanges().pipe(take(1)),
        this.db.list(`${divisionPath}/undecided-principles`).valueChanges().pipe(take(1))
      ).pipe(take(1))
      .subscribe(([principles, undecided]) => {
        this.voteType = 'principle';
        this.voteDropdown = differenceBy(this.globalPrinciples, principles, 'title').map((principle) => {
          console.log('find ', principle, undecided, find(undecided, ['title', principle.title]));
          return (find(undecided, ['title', principle.title])) 
            ? { ...principle, noDecision: true }
            : principle
        });
        console.log("set dropdown: ", principles, undecided, this.voteDropdown)
      })
    } else if (type === 'scenarios') {
      this.db.list(`${divisionPath}/scenarios`)
        .valueChanges()
        .pipe(take(1))
        .subscribe((scenarios) => {
          this.voteType = 'scenario';
          this.voteDropdown = differenceBy(this.globalScenarios, scenarios, 'title');
        })
    }
  }

  setScenario(selection) {
    const scenario = `${this.divisionVote.vote.result} ${selection.result}`;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: selection
    })

    this.db.list(`${this.divisionPath}/scenarios`).push({
      title: this.divisionVote.vote.title,
      value: scenario
    })
  }

  setPrinciple(selection) {
    const principle = `${this.divisionVote.vote.result} ${selection.result}`;
    console.log('SET PRINCIPLE: ', this.divisionVote)
    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: selection,
      noDecision: false
    })

    this.db.list(`${this.divisionPath}/principles`).push({
      title: this.divisionVote.vote.title,
      value: principle
    })
  }

  setResolution(selection) {
    const resolution = `${this.divisionVote.vote.result} ${selection.result}`;
    const consequence = selection?.consequence ?? null;
    const resolutionData = {
      title: this.divisionVote.vote.title,
      value: resolution,
      consequence, 
      cosequencesImplemented: false
    }

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: selection
    })
    this.db.object(`${this.divisionPath}/lastResolution`).set(resolutionData)
    console.log("set resolution: ", resolutionData)
    this.db.list(`${this.divisionPath}/resolutions`).push(resolutionData)
  }

  clearVote() {
    this.divisionVote = null;
    this.action = 'resolution-review';
    this.db.object(`${this.divisionPath}/vote`).set(null);
  }

  submitChat(division) {
    if (!trim(this.chatInput)) return;
    this.db.list(`shows/${this.showKey}/feeds/${this.divisionKey}`)
      .push({ from: this.divisionKey, type: 'chat', value: this.chatInput })
      .then((res) => { 
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
      this.dismissSheet();
    })
  }

  changeResources(value) {
    const wealth = this.bankService.calculateWealth(this.selectedCitizen.resources);
    if (value > wealth) {
      this.addResources(value - wealth);
    } else if (value < wealth) {
      this.removeResources(wealth - value);
    } else {
      this.dismissSheet();
    }
  }

  addResources(amount) {
    this.bankService.depositResources(
      this.showKey,
      this.divisionKey,
      this.selectedCitizen.id,
      this.bankService.quickConvert(this.divisionKey, amount)
    ).then(() => {
      this.dismissSheet();
    })
  }

  marketView(view) {
    console.log('change market view: ', view);
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/marketView`).set(view)
  }

  onResourceTypeSelect(x) {
    this.resourceType = toNumber(x?.id);
  }

  nextSeason(division, newSeason) {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/focus`).set('new-season');
    this.startSeason(division, newSeason);
  }

  async startSeason(division, newSeason) {
    console.log('start season', division);
    await this.divisionService.validateThreshold(this.showKey, this.divisionKey);
    const landTiles = await this.divisionService.setLandTiles(this.showKey, this.divisionKey)
    this.harvest = this.generateHarvest(landTiles, newSeason?.harvest, newSeason?.contaminantLevel);

    if (division.season > 0) {
      await this.db.object(`shows/${this.showKey}/global`).query.ref.transaction((global) => { 
        const result = global === null ? { 
          actual: toNumber(division?.actions),
          capacity: toNumber(division?.capacity)
         } : { 
           actual: toNumber(global?.actual) + toNumber(division?.actions),
           capacity:  toNumber(global?.capacity) + toNumber(division?.capacity),
         }
        console.log({result})
        return result
      })
    }

    await this.db.object(`${this.divisionPath}`).update({
      harvestColumn: division.lockHarvestColumns
        ? division.harvestColumn
        : _.range(7).map(() => true),
      season: newSeason.season,
      contaminantLevel: newSeason.contaminantLevel,
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
      actions: 0,
      selection: null
    })

    this.resetCitizenActions();
    this.showModal = false;
    setTimeout(() => {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/focus`).set('harvest')
    }, 3000)
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

    if (!citizens[0]?.id) return;

    citizens.forEach((citizen) => {
      this.db.object(`${this.divisionPath}/citizens/${citizen.id}`).update({
        actions: 0
      });
    })

    this.db.object(`${this.divisionPath}/turn`).set(
     citizens[0].id
    )
  }

  private generateHarvest(landTiles, harvestableCards, contaminantLevel = 1): Array<LandTile> {
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
      if (includes(contaminants, i)) {
        tiles[i].value = getRandomInt(1, contaminantLevel)
        tiles[i].type =  LandCardTypes.C
      } else {
        tiles[i].value = getRandomInt(1, 3)
        tiles[i].type =  LandCardTypes.R
      }
    })

    return tiles;
  }

  private resetLandTiles(tiles) {
    return tiles.map((tile) => ({
      ...tile,
      value: -1,
      contaminated: false,
      harvested: false,
      hash: Date.now().toString()
    }))
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
