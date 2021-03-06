import { Component, HostListener, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { formatDate, getRandomInt, pluckRandom, promiseOne } from 'src/app/utilties';
import { LandTile, LandCardTypes } from 'src/app/interfaces';
import * as _ from 'lodash';
import { trim, find, findIndex, includes, toNumber, each, partition } from 'lodash';
import { take, delay, map, tap, filter, takeUntil } from 'rxjs/operators'
import { Subject, combineLatest } from 'rxjs';
import { BankService } from 'src/app/services/bank.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ButtonGroupComponent } from 'src/app/components/shared/button-group/button-group.component';
import { DivisionService } from 'src/app/services/division-service.service';
import { faPen, faGavel, faScroll, faLandmark, faBullseye, faEyeSlash, faGlobe, faLeaf, faCartPlus, faEye, faShoppingBag, faMicroscope } from '@fortawesome/free-solid-svg-icons';
import { LandGridComponent } from 'src/app/components/shared/land-grid/land-grid.component';
import * as fa from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { DemoTilesComponent } from 'src/app/components/shared/demo-tiles/demo-tiles.component';

const DIVISIONS = ["N", "E", "S", "W", "NE", "SE", "SW", "NW"];

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss'],
  host: {
    '[class.app-host]': '!ipad',
    '[class.app-ipad-host]': 'ipad'
  }
})
export class HostComponent implements OnInit, OnDestroy {
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log({event})
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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    console.log('key event: ', event)
    if (event.key === 'Enter') {
      console.log("ENTER", this.actionSheet);
      // this.write();
    }
  }

  @ViewChild('harvestTemplate') harvestTemplate: TemplateRef<any>;
  @ViewChild('principleTemplate') principleTemplate: TemplateRef<any>;
  @ViewChild('resolutionTemplate') resolutionTemplate: TemplateRef<any>;
  @ViewChild('resolutionReviewModalTemplate') resolutionReviewModalTemplate: TemplateRef<any>;
  @ViewChild('scenarioTemplate') scenarioTemplate: TemplateRef<any>;
  @ViewChild('miscTemplate') miscTemplate: TemplateRef<any>;
  @ViewChild('reviewTemplate') reviewTemplate: TemplateRef<any>;
  @ViewChild('newSeasonTemplate') newSeasonModal: TemplateRef<any>;
  @ViewChild('customVoteTemplate') customVoteTemplate: TemplateRef<any>;
  @ViewChild('secondaryVoteTemplate') secondaryVoteTemplate: TemplateRef<any>;
  @ViewChild('ipadFinalVoteTemplate') ipadFinalVoteTemplate: TemplateRef<any>;
  
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
  @ViewChild('mockLocalLandSheet') mockLocalLandSheet: TemplateRef<any>;
  @ViewChild('mockGlobalLandSheet') mockGlobalLandSheet: TemplateRef<any>;

  @ViewChild('harvestTileSheet', { static: false }) harvestTileSheet: TemplateRef<any>;

  DIVISIONS = DIVISIONS
  modalContent: TemplateRef<any>;

  scanMode = false;
  demoScanContaminated = false;
  showSize = 'normal';
  ipad = true;
  fullscreen = false;

  // ICONS
  faPen = faPen;
  fa = fa;
  exploreIcon = faEye;
  gatherIcon = faShoppingBag;
  visibleIcon = faEyeSlash;
  highlightIcon = faBullseye;
  radarIcon = faMicroscope;

  showModal = false;
  _ = _;

  focusButtons = [
    { id: 'harvest', label: 'Harvest', faIcon: faLeaf },
    { id: 'principles', label: 'Principle', faIcon: faLandmark },
    { id: 'resolutions', label: 'Resolution', faIcon: faGavel },
    { id: 'scenario', label: 'Scenario', faIcon: faGlobe },
    { id: 'misc', label: 'Market', faIcon: faCartPlus },
    { id: 'review', label: 'Review', faIcon: faScroll }
  ]

  ipadFocusButtons = [
    { id: 'principles', label: 'Principle' },
    { id: 'resolutions', label: 'Resolution' },
    { id: 'scenario', label: 'Scenario' }
  ]

  ipadTabs;
  ipadDesktop;

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
  
  $deck;
  $advancements;
  $vote;
  $sell;
  $division;
  $citizens;
  $capacity;
  $resolutions;
  $divisionReview;
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
  $reserveData;
  $globalData;

  private _voteDropdownSelect = null;
  get voteDropdownSelect() { return this._voteDropdownSelect };
  set voteDropdownSelect(value) {
    console.log('set: ', value, this.focus)
    this._voteDropdownSelect = value;
    if (this.focus) {
      this.startVote(this.focus);
    }
  }
  secondaryVoteDropdownSelect;


  showDate;
  showNumber;
  showKey;
  scanResult;
  isScanning = false;
  scanContamTiles;
  scanCount = 1;

  landCost;
  customVoteInput;
  currentSeason;
  voteState;
  selectedCitizen;
  selectedLandTile;
  changeAttribute;
  changeListAttribute;
  hostAction;
  divisions;
  actionSheet;
  voteResultFunds = 0;
  contamination;
  divisionContamination;
  harvest;
  divisionColor;
  divisionKey;

  divisionPath;
  landTilesPath;
  chatInput = "";
  focus = 'none';
  action = 'harvesting';
  divisionVote;
  voteNotes = "";
  voteType;
  fontSize = 16;
  globalResolutions;
  globalPrinciples; 
  globalScenarios;
  voteDropdown;
  rightTab;
  leftTab;
  ipadTab = 'division';
  citizenCount = 0;
  positions;
  lockColumns;
  divisionScore;
  landmarks;
  reportContaminationButtons;

  finalVote = {
    first: {
      division: 'N',
      weight: 0,
    },
    second: {
      division: 'N',
      weight: 0
    }
  }

  ipadDropdownSelections = {
    principles: null,
    resolutions: null,
    scenario: null
  };

  generateMockLand = (value) => _.range(value).map((n) => ({
    division: this.divisionKey,
    id: 0,
    color: this.divisionColor,
    name: 'X'
  }))

  localLandWritePath;
  globalLandWritePath;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private bank: BankService,
    private bottomSheet: MatBottomSheet,
    private divisionService: DivisionService,
    public bankService: BankService
  ) {}

  onKeydown(ev) {
    console.log({ev})
  }

  ngOnInit() {
    this.divisionKey = this.route.snapshot.params.division;
    this.showKey = this.route.snapshot.params.show;
    this.ipad = this.route.snapshot.queryParams.ipad == 'true';
    this.localLandWritePath = `shows/${this.showKey}/divisions/${this.divisionKey}/localLand`
    this.globalLandWritePath = `shows/${this.showKey}/divisions/${this.divisionKey}/globalLand`
    this.setShowArchiveParams();

    this.$reserveData = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserveThresholds`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/color`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/nextSeason/harvest`).valueChanges(),
    ).pipe(
      map(([reserve, thresholds, color, harvest]: [any, any, string, number]) => {
        return {
          reserve: {
            value: reserve,
            percent: Math.min(100, toPercent(reserve, thresholds.high))
          },
          thresholds: [
            { 
              value: thresholds.low,
              percent: toPercent(thresholds.low, thresholds.high),
            },
            {
              value: thresholds.mid,
              percent: toPercent(thresholds.mid, thresholds.high),
            },
            {
              value: thresholds.high,
              percent: 100
            }
          ],
          color,
          deck: this.divisionService.getDeck(reserve, thresholds, harvest)
        }
      })
    )

    this.db.object('shows').valueChanges().pipe(takeUntil(this.destroy$)).subscribe(
      (shows) => {
        if (!shows[this.showKey]) {
          window.location.reload();
        }
      }
    )

    this.$advancements = this.divisionService.$advancements(this.showKey, this.divisionKey).pipe(
      tap((n) => console.log({n}))
    )
    this.$globalData = combineLatest(DIVISIONS.map((key: string) => (
      this.db.object(`shows/${this.showKey}/divisions/${key}`).valueChanges()
    ))).pipe(
      tap((glc) => console.log({glc})),
      map((divisions) => _.map(divisions, (division) => ({
        landCost: division?.landCost,
        color: division?.color,
        season: division?.season,
        score: division?.score,
        key: division?.code
      }))),
      tap((after) => console.log({after}))
    )
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
  
    this.db.object(`${this.divisionPath}/landmarks`).valueChanges().pipe(
      takeUntil(this.destroy$)
    ).subscribe((landmarks) => {
      this.landmarks = landmarks;
    })

    this.db.object(`showSize`).valueChanges().pipe(
      takeUntil(this.destroy$)
    ).subscribe((showSize: any) => {
      console.log("set showsize: ", showSize)
      this.showSize = showSize;
    })

    this.$sell = this.db.object(`${this.divisionPath}/sell`).valueChanges();

    this.$division = this.db.object(this.divisionPath).valueChanges().pipe(
      filter((x) => x !== null && x !== undefined),
      tap((div: any) => {
        this.landCost = div.landCost;
        this.currentSeason = div.season;
        console.log('SET CURRENT SEASON: ', this.currentSeason)
        if (div.score !== 'Low' && this.divisionScore !== div.score && !this.landmarks?.[div.score]) {
          this.divisionScore = div.score;
          setTimeout(() => {
            this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionLargePopup`).set({
              type: 'Rating',
              header: `Things are changing`,
              message: `The ${div.name} is now at a ${div.score} rating`,
            })
            this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/landmarks/${div.score}`).set(true)
          }, this.ipad ? 0 : 3500)
        }
      })
    );
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        tap((citizens) => {
          if (this.citizenCount !== citizens.length) {
            this.updatePositions();
          }
          this.citizenCount = citizens.length;
      })
    )
    this.$actions = this.db.object(`${this.divisionPath}/actions`).valueChanges();
    this.$capacity = this.db.object(`${this.divisionPath}/capacity`).valueChanges();
    this.$exports = this.db.list(`${this.divisionPath}/exports`).valueChanges().pipe(map((exports) => exports.reverse()));
    this.$lastResolution = this.db.object(`${this.divisionPath}/lastResolution`).valueChanges()
    this.$resolutions = this.db.list(`${this.divisionPath}/resolutions`).valueChanges();
    this.$divisionReview = this.db.object(`${this.divisionPath}/divisionReview`).valueChanges();
    this.$principles = this.db.list(`${this.divisionPath}/principles`).valueChanges();
    this.$scenarios = this.db.list(`${this.divisionPath}/scenarios`).valueChanges();
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges().pipe(tap((focus: string) => { 
      console.log("FOCUS: ", focus)
      return this.focus = focus }));

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

    this.divisionService.calculateDivisionScore$(this.showKey, this.divisionKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
    // this.divisionService.thresholdListener$(this.showKey, this.divisionKey).subscribe();

    combineLatest(
      this.db.object(`shows/${this.showKey}/contamination/current`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserveThresholds`).valueChanges(),
    ).pipe(
      takeUntil(this.destroy$),
      map(([contamination, reserve, { low, mid, high }]: [
        number, number, { low: number, mid: number, high: number }
      ]) => {
        const thresholdReached = this.getThresholdReached(reserve, [low, mid, high]);
        return {
          divisionContam: Math.max(5, contamination - (thresholdReached * 5)),
          globalContam: contamination
        }
      })
    ).subscribe(({ divisionContam, globalContam }) => {
      this.contamination = globalContam;
      this.divisionContamination = divisionContam;
    })

    this.getResolutions();
    this.getPrinciples();
    this.getScenarios();
  }

  async setShowArchiveParams() {
    this.showNumber = await this.db.object(`shows/${this.showKey}/showNumber`)
      .valueChanges()
      .pipe(take(1))
      .toPromise() ?? 1;
    this.showDate = formatDate(new Date(), 'mmddyy');
  }

  changeAdvancement({ key, type }) {
    if (type === 'global') {
      this.changeDivisionProperty(`advancements/${key}/communal`, key);
    } else {
      this.changeDivisionProperty(`advancements/${key}/communal`, `${type} ${key}`);
    }
  }

  mockLand(type) {
    this.actionSheet = (type === 'global') 
      ? this.bottomSheet.open(this.mockGlobalLandSheet)
      : this.bottomSheet.open(this.mockLocalLandSheet);
  }

  async setMockLand(type, value) {
    console.log('mock land: ', type, value);
    const mockLand = _.range(value).map((n) => ({
      division: this.divisionKey,
      id: 0,
      color: this.divisionColor,
      name: 'X'
    }))
    await this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/${type}Land`).set(mockLand);
    this.dismissSheet();
  }

  mockScan() {
    this.processScan({
      harvested: 1,
      contaminantsFound: this.demoScanContaminated ? 1 : 0
    });
  }

  getThresholdReached(reserve, thresholds) {
    let threshold = 0;
    thresholds.forEach((th) => {
      if (reserve >= th) {
        threshold++;
      }
    });
    return threshold;
  }

  async scanResource() {
    let totalHarvest: number;
    let contamPercent: number;
    let contamLevel: number;
    let thresholdReached: number;

    await new Promise((resolve) => combineLatest(
        this.db.object(`shows/${this.showKey}/contamination/current`).valueChanges(),
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/harvest`).valueChanges(),
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/contaminantLevel`).valueChanges(),
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges(),
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserveThresholds`).valueChanges(),
      ).pipe(
      take(1)
    ).subscribe(([percent, harvest, level, reserve, { low, mid, high }]: [
        number,
        number,
        1 | 2 | 3,
        number,
        { low: number, mid: number, high: number }
      ]) => {
      totalHarvest = harvest;
      thresholdReached = this.getThresholdReached(reserve, [low, mid, high]);
      contamPercent = Math.max(5, percent - (thresholdReached * 5));
      contamLevel = level;
      console.log('threshold reached: ', thresholdReached, 'og percent: ', percent, 'adjusted percent: ', contamPercent);
      resolve(null);
    }));

    console.log({totalHarvest, contamPercent, contamLevel});

    let isContaminated;
    let contamsRemaining; 
    let harvestRemaining;
    let scanResults;

    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/scan`)
      .query.ref.transaction((scan: { contaminantsFound: number, harvested: number }) => { 
        const currentScan = scan ?? { contaminantsFound: 0, harvested: 0 };
        const totalContams = Math.ceil((contamPercent / 100) * totalHarvest) ?? 0;

        contamsRemaining = totalContams - currentScan.contaminantsFound;
        harvestRemaining = totalHarvest - currentScan.harvested;
        
        scanResults = this.getScanResults(contamsRemaining, harvestRemaining);
        console.log({scanResults})

        currentScan.contaminantsFound += scanResults?.contaminantsFound;
        currentScan.harvested += scanResults?.harvested;

        return currentScan;
      }).then(() => {
        this.processScan(scanResults, contamLevel, harvestRemaining, contamsRemaining);
      });
  }

  getScanResults(_contamsRemaining, _harvestRemaining) {
    let contamsRemaining = _contamsRemaining;
    let harvestRemaining = _harvestRemaining;

    const results = _.range(this.scanCount).map(() => {
      const pick = getRandomInt(1, harvestRemaining);
      const isContaminated = (pick <= contamsRemaining) && (contamsRemaining  > 0);
      contamsRemaining = isContaminated ? Math.max((contamsRemaining - 1), 0) : contamsRemaining;
      harvestRemaining = Math.max(0, harvestRemaining - 1);
      return isContaminated;
    });

    return {
      results,
      contaminantsFound: _contamsRemaining - contamsRemaining,
      harvested: _harvestRemaining - harvestRemaining
    };
  }

  onScanCountChange(value: number) {
    this.scanCount = value;
  }

  exitScan() {
    this.scanMode = false;
    this.resetScan();
  }

  resetScan() {
    this.scanCount = 1;
    this.isScanning = false;
    this.scanResult = undefined;
  }

  demoScan(contam) {
    this.demoScanContaminated = contam;
    this.scanMode = true;
  }

  async reportContaminations(button) {
    if (this.currentSeason === 0) {
      this.resetScan();
      return;
    }
    const toReport = _.toNumber(button.label)
    if (toReport > 0) {
      await this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/scan`)
      .query.ref.transaction((scan: { contaminantsFound: number, harvested: number }) => {
        let contamsFound = 0;
        const picks = _.range(toReport).map(n => { 
          const randn = getRandomInt(1, this.scanResult.harvestRemaining - n)
          const contaminated = (randn <= Math.max(0, (this.scanResult.contamsRemaining - contamsFound)));
          if (contaminated) {
            contamsFound++;
          }
          console.log(n, ': ', {
            harvestRemainging: this.scanResult.harvestRemaining - n,
            contamsRemaining: this.scanResult.contamsRemaining - contamsFound,
            randn,
            contamsFound,
            contaminated
          })
          return contaminated
        }) 

        const contaminants = _.filter(picks, p => p === true).length;
        return {
          contaminantsFound: _.toNumber(scan.contaminantsFound) + contaminants,
          harvested: _.toNumber(scan.harvested) + toReport,
        }
      });
    }
    console.log("scan result: ", this.scanResult)
    this.resetScan();
  }

  async processScan(scanResults, level=1, harvestRemaining=0, contamsRemaining=0) {
    console.log('process this: ', scanResults)
    this.isScanning = true;
    setTimeout(() => {
      if (scanResults?.results?.length > 1) {
        this.scanResult = {
          harvestRemaining,
          contamsRemaining,
          contaminated: null,
          multi: true,
          results: scanResults.results,
          header: null,
          image: null
        }
      } else {
        if (scanResults.contaminantsFound === 1) {
          const contaminantValue = this.divisionService.getContaminantValue(level)
          this.scanResult = {
            harvestRemaining,
            contamsRemaining,
            contaminated: true,
            multi: null,
            header: 'Contaminant detected',
            image: `../assets/C${contaminantValue}.png`
          }
          this.reportContaminationButtons = this.generateReportContaminationButtons(contaminantValue);
        } else {
          this.scanResult = {
            harvestRemaining,
            contamsRemaining,
            contaminated: false,
            multi: null,
            header: 'No contaminants detected',
            image: ''
          }
        }
      }

      this.isScanning = false;
    }, 300)
  }

  generateReportContaminationButtons(value) {
    let count = 3;
    if (value == 2) {
      count = 5;
    } else if (value == 3) {
      count = 9;
    }
    return _.range(count).map(n => ({ id: `report-${n}`, label: `${n}` }))
  }

  startFinalVote() {
    this.modalContent = this.ipadFinalVoteTemplate;
    this.showModal = true;
  }

  submitFinalVote() {;
    this.showModal = false;
    if (confirm("Are you sure you want to submit these votes?")) {
      this.db.object(`shows/${this.showKey}/finalVotes/${this.divisionKey}`).set(this.finalVote);
    }
  }

  setFullScreen() {
    this.fullscreen = true;
    const elem: any = document.documentElement as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }

  exitFullScreen() {
    this.fullscreen = false;
    const doc: any = document;
    if (doc.exitFullscreen) {
      document.exitFullscreen();
    } else if (doc.mozCancelFullScreen) { /* Firefox */
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) { /* IE/Edge */
      doc.msExitFullscreen();
    }
  }

  async updatePositions() {
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    const citizens = await promiseOne(this.db.list(`${divisionPath}/citizens`));
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
      setTimeout(() => {
        this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViewHighlight`).remove();
      }, 2000)
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
    if (this.rightTab === 'notifications' || tab.id === 'notifications') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenNotifications`).remove();
    }

    if (this.leftTab === 'central' || tab.id === 'central') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenChat`).set(0)
    }
    
    if (this.rightTab === 'news' || tab.id === 'news') {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/unseenNews`).remove();
    }
    this.rightTab = tab.id;
  }

  async onLeftTabChange(tab) {
    this.leftTab = tab.id;
  }

  async onIpadTabChange(tab, _focus) {
    const focus = _.includes(['principles', 'resolutions', 'scenario'], _focus)
      ? _focus
      : 'principles';
    this.ipadTab = tab.id;
    this.setIpadVoteFocus(focus);
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
    if (advancement > 3 || !this.selectedCitizen?.id) return;
    const wealth = this.bankService.calculateWealth(this.selectedCitizen.resources);
    if (wealth >= price) {
      this.db.object(updatePath).query.ref.transaction(adv => ++adv ?? 1)
      this.bankService.spendResources(this.showKey, this.divisionKey, this.selectedCitizen?.id, price);
    }
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
      }]);
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
        duration: 3000
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

  onTurnSelect(id) {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/turn`)
      .set(id)
    // this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/divisionPopup`).set({
    //   message: `It is now ${this.selectedCitizen.name}'s turn!`,
    //   duration: 2000
    // })
  }

  onIpadVoteFocusSelect(button) {
    const focus = _.includes(['principles', 'resolutions', 'scenario'], button?.id)
      ? button?.id
      : 'principles';
    this.setIpadVoteFocus(focus);
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
    console.log('autopick: ', focus, this.voteDropdown, this.voteDropdownSelect)
    const untouched = this.voteDropdown.filter((option) => !option.votedOn);
    console.log('untouched: ', untouched)
    this.voteDropdownSelect = pluckRandom(untouched, 1)[0];
  }

  onVoteOptionChange(ev) {
    console.log("on vote option change: ", ev)
  }

  async generateArchivedReview() {
    const archiveId = `${this.showDate}/${this.showNumber}`;
    const review = await combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/score`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/reserve`).valueChanges(),
      this.divisionService.$advancements(this.showKey, this.divisionKey),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/sell`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/chartData`).valueChanges().pipe(
        map((data: any[]) => {
          const percent = data.reduce((acc, [_, c, a]) => (acc + ((a - c) / c) * 100), 0);
          return `${Math.round(percent)}%`;
        }),
      ),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/citizens`).valueChanges().pipe(
        map((citizens) => {
          console.log({citizens})
          let inHand = 0;
          each(citizens, (c) => {
            inHand += this.bankService.calculateWealth(c.resources);
          })
          return inHand;
        }),
        tap((hand) => console.log({hand}))
      ),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/localLand`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/globalLand`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/principles`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/resolutions`).valueChanges(),
      this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/scenarios`).valueChanges(),
    ).pipe(
      map(([score, reserve, advancements, sell, exceededCapacity, inHand, localLand, globalLand, principles, resolutions, scenarios]) => ({
        code: this.divisionKey, score, reserve, advancements, sell, exceededCapacity, inHand, localLand, globalLand, principles, resolutions, scenarios
      })),
      take(1)
    ).toPromise();
    console.log({review});
    this.db.object(`shows/${this.showKey}/archive/${archiveId}/${this.divisionKey}`).set(review).then(() => console.log("review set"))
  }

  startVote(focus) {
    console.log("vote on : ", focus, this.voteDropdownSelect)
    this.db.object(`${this.divisionPath}/focus`).set(focus);
    this.showModal = false;
    this.action = 'voting';

    if (this.voteDropdownSelect) {
      setTimeout(() => {
        this.db.object(`${this.divisionPath}/vote`).set({
          type: this.voteType,
          ...this.voteDropdownSelect,
          state: 'voting',
          votes: {}
        })
      }, 1000)
    }
  
  }

  newResolution() {
    this.setVoteDropdown('resolutions');
    this.modalContent = this.resolutionTemplate;
    this.showModal = true;
  }


  async setIpadVoteFocus(_type) {
    const type = _type === 'none' ? 'principles' : _type;
    console.log("set ipad focus: ", type, )
    this.clearVote();
    if (type === 'principles') {
      this.setVoteDropdown('principles');
    } else if (type === 'resolutions') {
      this.setVoteDropdown('resolutions');
    } else if (type === 'scenario') {
      this.setVoteDropdown('scenarios');
    }
    // this.autoPick(type);
    this.db.object(`${this.divisionPath}/focus`).set(type);
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
    // this.setNewContamination();
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
    console.log("SELECTION CHANGE: ", selection);
  }

  onVoteChange(vote) {
    this.divisionVote = { selection: undefined, vote };
  }

  onVoteDropdownSelectChange(selection, focus) {
    this._voteDropdownSelect = selection;
    this.ipadDropdownSelections[focus] = selection;
    console.log("dropdown change: ", selection, focus, this.ipadDropdownSelections)
    this.startVote(focus);
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
    this.focusButtonsComponent?.reset();
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

  doNotAct(type) {
    console.log("implement do not act")
    this.voteDropdownSelect.resolved = true;
    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      noDecision: true,
    });
    if (type === 'scenario') {
      this.pushToCentral('scenarios', `${this.divisionVote.vote.result} did not act`);
    } else {
      this.db.object(`${this.divisionPath}/lastResolution`).remove();
      this.pushToCentral('resolutions', `${this.divisionVote.vote.result} did not act`);
    }
  }

  noDecision() {
    this.voteDropdownSelect.resolved = true;
    console.log("implements no decision")
    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      noDecision: true,
    });
    this.pushToCentral('principles', `Regarding ${this.divisionVote.vote.title}, the division did not make a decision`);
  }

  customVoteOption() {
    console.log('custom vote: ', this.divisionVote)
    this.modalContent = this.customVoteTemplate;
    this.showModal = true;
  }

  implementSecondaryVote() {
    console.log("implement secondary vote: ", this.divisionVote);
    this.setScenario(this.divisionVote.selection);
    this.showModal = false;
  }

  implement(customVote=null) {
    const selection = customVote
      ? { result: customVote }
      : this.divisionVote.selection;

    if (!this.divisionVote) return;
    if (this.divisionVote.vote.type === 'resolution') {
      if (customVote){
        selection.consequence = 'Make something up!'
      }
      this.setResolution(selection);
    } else if (this.divisionVote.vote.type === 'principle') {
      console.log("principle vote... ")
      this.setPrinciple(selection);
    } else if (this.divisionVote.vote.type === 'scenario') {
      console.log("Check for secondary prompt: ", this.divisionVote.selection);
      if (this.divisionVote?.selection?.secondaryPrompt) {
        this.modalContent = this.secondaryVoteTemplate;
        this.showModal = true;
        return
      } else {
        this.setScenario(selection);
      }
    }
    this.voteDropdownSelect.resolved = true;
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
    console.log('set vote dropdown: ', type, 'VOTE SELECTION: ', this.voteDropdownSelect);
    const divisionPath = `shows/${this.showKey}/divisions/${this.divisionKey}`;
    this.voteDropdown = null;
    this.voteDropdownSelect = null;
    
    if (type === 'resolutions') {
      this.db.list(`${divisionPath}/resolutions`).valueChanges().pipe(take(1))
      .subscribe(async (resolutions) => {
          console.log({resolutions})
          this.voteType = 'resolution';
          await this.getResolutions();
          this.voteDropdown = this.globalResolutions.map((resolution) => {
            return (find(resolutions, ['title', resolution.title])) 
              ? { ...resolution, votedOn: true }
              : resolution
          });
          if (!this.ipadDropdownSelections.resolutions?.resolved) {
            this.voteDropdownSelect = this.ipadDropdownSelections.resolutions
          }
          console.log("!SET RESOLUTION ", this.voteDropdownSelect)
        });
    } else if (type === 'principles') {
      this.db.list(`${divisionPath}/principles`).valueChanges().pipe(take(1))
        .subscribe(async (principles) => {
          this.voteType = 'principle';
          await this.getPrinciples();
          this.voteDropdown = this.globalPrinciples.map((principle) => {
            return (find(principles, ['title', principle.title])) 
              ? { ...principle, votedOn: true }
              : principle
          });
          if (!this.ipadDropdownSelections.principles?.resolved) {
            this.voteDropdownSelect = this.ipadDropdownSelections.principles;
          }

          console.log("!VOTE PRINCIPLE: ", this.voteDropdownSelect)
        })
    } else if (type === 'scenarios') {
      this.db.list(`${divisionPath}/scenarios`).valueChanges().pipe(take(1))
        .subscribe(async (scenarios) => {
          this.voteType = 'scenario';
          await this.getScenarios();
          this.voteDropdown = this.globalScenarios.map((scenario) => {
            return (find(scenarios, ['title', scenario.title]))
              ? { ...scenario, votedOn: true }
              : scenario
          })
          if (!this.ipadDropdownSelections.scenario?.resolved) {
            this.voteDropdownSelect = this.ipadDropdownSelections.scenario;
          }
          console.log("!SET SCENARIO ", this.voteDropdownSelect)
        })
    }
    console.log("!dropdown select: ", this.voteDropdownSelect)
  }

  setScenario(selection) {
    const additionalMessage = selection.secondaryPrompt
      ? `${selection.secondaryPrompt.prompt} ${this.secondaryVoteDropdownSelect}`
      : ''
    const scenario = `${this.divisionVote.vote.result} ${selection.result}`;
    const note = `${additionalMessage} division.`;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: selection
    })

    this.pushToCentral('scenarios', scenario, note)
  }

  setPrinciple(selection) {
    console.log("set principle!", selection)
    const principle = `${this.divisionVote.vote.result} ${selection.result}`;

    this.db.object(`${this.divisionPath}/vote`).update({
      state: 'final',
      selected: selection,
      noDecision: false
    })

    this.pushToCentral('principles', principle);
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

    if (consequence === null || consequence?.trim() === 'none') {
      this.db.object(`${this.divisionPath}/lastResolution`).remove();
    } else {
      this.db.object(`${this.divisionPath}/lastResolution`).set(resolutionData)
    }
    this.pushToCentral('resolutions', resolution);
  }

  async pushToCentral(type, message, note=null) {
    console.log("push to central: ", type, message)
    const entries = await promiseOne(this.db.list(`${this.divisionPath}/${type}`));
    const indexOfEntry = findIndex(entries, ['title', this.divisionVote.vote.title]);
    const update = {
      title: this.divisionVote.vote.title,
      value: message
    }

    if (indexOfEntry !== -1) {
      entries[indexOfEntry] = update;
      this.db.object(`${this.divisionPath}/${type}`).set(entries);
    } else {
      this.db.list(`${this.divisionPath}/${type}`).push(update)
    }

    this.db.list(`shows/${this.showKey}/feeds/${this.divisionKey}`).push({
      from: this.divisionKey,
      type: 'vote',
      header: this.divisionVote.vote.title,
      value: message,
      note,
      timestamp: moment().format('h:mm:ss')
    })

    this.db.object(`shows/${this.showKey}/centralUnseen/${this.divisionKey}`)
      .query.ref.transaction((unseen) => ++unseen)
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

  nextSeason() {
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/focus`).set('new-season');
    this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}`).valueChanges().pipe(
      take(1)
    ).subscribe((data: any) => {
      this.loadSeason(data, data?.nextSeason);
    })
  }

  async loadSeason(division, newSeason) {
    this.showModal = false;
    const level = await this.divisionService.getThresholdLevel(this.showKey, this.divisionKey);
    const landTiles = await this.divisionService.setLandTiles(this.showKey, this.divisionKey)
    this.harvest = this.generateHarvest(landTiles, level, newSeason?.harvest, newSeason?.contaminantLevel);

    if (division.season > 0) {
      await this.db.list(`shows/${this.showKey}/divisions/${this.divisionKey}/chartData`).push([
        division.season,
        division.capacity,
        division.actions
      ])
    }

    await this.db.object(`${this.divisionPath}/highThresholdsMet`).query.ref.transaction((htm) => {
      return newSeason.highThresholdMet ? htm + 1 : htm
    })

    await this.db.object(`${this.divisionPath}`).update({
      score: newSeason.score,
      harvestColumn: division.lockHarvestColumns
        ? division.harvestColumn
        : _.range(7).map(() => true),
      season: newSeason.season,
      contaminantLevel: newSeason.contaminantLevel,
      capacity: newSeason.capacity,
      harvest: newSeason.harvest,
      reserveThresholds: {
        low: newSeason.thresholds[0],
        mid: newSeason.thresholds[1],
        high: newSeason.thresholds[2]
      },
      landCost: newSeason.landCost,
      landTiles: this.harvest,
      actions: 0,
      selection: null, 
      scan: {
        contaminantsFound: 0,
        harvested: 0
      }
    })

    this.resetCitizenActions();

    setTimeout(() => {
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/focus`).set('harvest');
    }, 3000)
  }

  newHarvest() {
    if (confirm("Are you sure you want to start a new harvest?")) {
      this.updateNextSeason();
    }
  }

  updateNextSeason() {
    this.divisionService.newSeason(this.showKey, this.divisionKey, this.showSize);
  }

  newSeason(division=true) {
    if (!division) return;
    this.updateNextSeason();
    this.modalContent = this.newSeasonModal;
    this.showModal = true;
  }

  async resetSeason(division) {
    console.log('reset')
    if (!division) return;
    if (!confirm("Are you sure you want to reset this season?")) return;
    const level = await this.divisionService.getThresholdLevel(this.showKey, this.divisionKey);
    const landTiles = await this.divisionService.setLandTiles(this.showKey, this.divisionKey);
    this.harvest = this.generateHarvest(landTiles, level, division.harvest, division.contaminantLevel);
    await this.db.object(`${this.divisionPath}`).update({
      landTiles: this.harvest,
      actions: 0,
      selection: null, 
      scan: {
        contaminantsFound: 0,
        harvested: 0
      }
    })
    this.setNewContamination();
  }

  setNewContamination() {
    combineLatest(
      this.db.object(`shows/${this.showKey}/contamination/current`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/contaminantLevel`).valueChanges(),
    ).pipe(
      take(1)
    ).subscribe(([percent, level]) => {
      console.log({percent, level})
      if (this.landGrid) {
        this.landGrid.adjustContamination(percent, level);
        this.landGrid.updateDB();
      }
    })
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
    const citizens: any = await promiseOne(this.db.list(`${this.divisionPath}/citizens`));

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

  private generateHarvest(landTiles, thresholdLevel, harvestableCards, contaminantLevel = 1): Array<LandTile> {
    const tiles: LandTile[] = [ ...this.resetLandTiles(landTiles) ];
    const [owned, open]: LandTile[][] = partition(tiles, (tile) => tile.owner !== undefined);
    const harvestableCount = harvestableCards - owned.length;
    const harvestIndexes = [
      ...owned.map((tile: any) => tile.index),
      ...pluckRandom(open.map(
        (tile: any) => tile.index), harvestableCount > 0 ? harvestableCount : 0
      )
    ]
    let highResources = thresholdLevel;
    let midResources = thresholdLevel * 2;
    harvestIndexes.forEach((i) => {
      let value = 1;
      if (highResources > 0) {
        value = 3;
        highResources--;
      } else if (midResources > 0) {
        value = 2;
        midResources--
      }
      tiles[i].value = value
      tiles[i].type = LandCardTypes.R
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

function toPercent(n, d) {
  return Math.round((toNumber(n) / toNumber(d)) * 100)
}