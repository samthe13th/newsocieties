import { Component, ViewChild, OnInit, TemplateRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlayerDeckComponent } from 'src/app/components/player/player-deck/player-deck.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LandGridComponent } from 'src/app/components/shared/land-grid/land-grid.component';
import { tap, take, map } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';
import { capitalize, toArray, includes, findIndex, filter, find } from 'lodash';
import { faLeaf, faFlag, faEye, faArchway, faBriefcaseMedical, faShieldAlt, faShoppingBag, faBrain, faTheaterMasks, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { DivisionService } from 'src/app/services/division-service.service';

const KEY_CODE = {
  e: 69,
  g: 71,
  enter: 13
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  host: {
    '[class.app-player]': 'true'
  }
})
export class PlayerComponent implements OnInit {
  $division;
  $turn;
  $citizens;
  $player;
  $playerView;
  $overlay;
  $pageState;
  $focusState;
  $vote;

  @ViewChild(PlayerDeckComponent, { static: false }) playerDeck: PlayerDeckComponent;
  @ViewChild(LandGridComponent, { static: false }) landGrid: LandGridComponent;
  @ViewChild('tileSelectSheet', { static: false }) sheetTemplate: TemplateRef<any>;
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.enter) {
      if (!this.signedIn) {
        this.signIn();
      } else if (!this.name) {
        this.setName();
      }
    }
  }

  private destroy$ = new Subject<boolean>();

  nameInput; 
  codeInput;

  position;
  user;
  loginValidations = [];
  signedIn = false;
  vote;
  divisionSummaries;
  currentTab = 'Division';
  id;
  name;
  divisionKey;
  divisionPath;
  showKey;
  selectedResourceStatus;
  actionSheet;
  selectedCard;
  voteSelection;
  focus = 'harvest';

  // DB PATHS
  landTilesPath;
  votePath;

  // ICONS
  exploreIcon = faEye;
  gatherIcon = faShoppingBag;
  kIcon = faBrain;
  aIcon = faTheaterMasks;
  iIcon = faArchway;
  sIcon = faShieldAlt;
  hIcon = faBriefcaseMedical;
  landIcon = faFlag;
  resourceIcon = faLeaf;

  
  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private divisionService: DivisionService,
    private router: Router,
    private _bottomSheet: MatBottomSheet,
  ) {}

  ngOnInit() {
    const { show, division, id } = this.route.snapshot.params;
    this.showKey = show;
    this.divisionKey = division;
    this.id = id;
    this.signedIn = this.id !== undefined;

    this.db.object(`shows/${this.showKey}/users`).valueChanges()
      .pipe(take(1))
      .subscribe((users) => {
        this.user = users[id];
        this.name = this.user?.name;
        if (this.id && this.name) {
          this.setPlayer();
        }
    })

    const showPath = `shows/${this.showKey}`;
    this.divisionPath = `${showPath}/divisions/${this.divisionKey}`;
    this.landTilesPath = `${this.divisionPath}/landTiles`;
    this.votePath = `${this.divisionPath}/vote`;
    this.$division = this.db.object(this.divisionPath).valueChanges();
    this.$playerView = combineLatest(
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViewHighlight`).valueChanges(),
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/playerViews`).valueChanges()
    ).pipe(
      map(([highlight, views]) => ({ highlight, views }))
    )
    this.$overlay = this.db.object(`${this.divisionPath}/overlay`).valueChanges();
    this.$pageState = this.db.object(`${this.divisionPath}/focus`).valueChanges()
      .pipe(
        map(focus => focus !== 'new-season' ? 'main' : 'newSeason')
      )
    this.$focusState = this.db.object(`${this.divisionPath}/focus`)
      .valueChanges()
      .pipe(tap((f) => console.log("FOCUS: ", f)))
    this.db.object(`shows/${show}/divisions`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((divisions) => {
        this.createDivisionListeners(divisions)
      })
  }

  signIn() {
    this.loginValidations = [];
    if (this.codeInput === 'ns-host') {
      this.router.navigate([this.showKey, 'host', this.divisionKey]);
    } else {
      this.db.object(`shows/${this.showKey}/users`).valueChanges()
        .pipe(take(1))
        .subscribe((users) => {
          this.user = users[this.codeInput];
          if (!this.user) {
            this.loginValidations.push("Sorry, this code is not correct");
          }
          if (this.loginValidations.length === 0) {
            this.db.object(`shows/${this.showKey}/users/${this.codeInput}`).update(
              { division: this.divisionKey }
            ).then(() => {
              console.log('redirect: ', this.user);
              this.navigateToPlayerPage(this.codeInput);
            })
          }
      })
    }
  }

  setName() {
    this.loginValidations = [];
    if (!this.nameInput) {
      this.loginValidations.push("Please include a name for yourself!");
    }
    if (this.loginValidations.length === 0) {
      this.continueToDivision(this.id, this.nameInput);
    }
  }

  continueToDivision(code, name) {
    this.name = name;
    if (this.user?.division === this.divisionKey || !this.user?.division) {
      this.joinDivision(code, name);
    } else {
      this.transferFromDivision(this.user.division, code);
    }
  }

  async transferFromDivision(division, code) {
    await this.divisionService.transferCitizen(this.showKey, division, this.divisionKey, code);
    this.navigateToPlayerPage(code);
  }
  
  async joinDivision(code, name) {
    await this.db.object(`shows/${this.showKey}/users/${code}/name`).set(name);
    await this.divisionService.addCitizen(this.showKey, this.divisionKey, code, name);
    this.setPlayer();
  }

  setPlayer() {
    console.log('set player: ', this.id);
    this.db.object(`${this.divisionPath}/turn`).query.ref.transaction((turn) => {
      return turn ?? this.id;
    })
    this.$player = this.db.object(`${this.divisionPath}/citizens/${this.id}`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges().pipe(
      tap((turn) => console.log("turn: ", turn))
    )
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        map((citizens) => citizens.map((c: any, index: number) => ({ ...c, position: index + 1 }))),
        tap((citizens) => this.position = find(citizens, ['id', this.id])?.position ),
        map((citizens) => filter(citizens, c => c.id !== this.id))
      );
    this.$vote = this.db.object(`${this.divisionPath}/vote`).valueChanges();
  }

  hasVoted(votes) {
    console.log(votes)
    return votes?.[this.id];
  }

  navigateToPlayerPage(code) {
    this.router.navigate([this.showKey, 'player', this.divisionKey, code]);
  }

  onSelectionChange({ vote, selection }) {
    this.vote = vote;
    this.voteSelection = findIndex(this.vote.options, ["prompt", selection.prompt]);
  }

  castVote() {
    console.log('cast vote')
    if (this.voteSelection !== undefined) {
      this.db.object(`${this.divisionPath}/vote/votes`).update({
        [this.id]: true
      });

      this.db.object(`${this.divisionPath}/vote/options/${this.voteSelection}/votes`).query.ref.transaction(
        (votes) => { 
          console.log('update vote... ', votes, this.voteSelection)
          return votes ? ++votes : 1
        }
      )
    }
  }

  createDivisionListeners(divisions) {
    this.divisionSummaries = toArray(divisions).map(division => {
      return this.db.object(`shows/${this.showKey}/divisions/${division.code}`).valueChanges();
    })
  }

  onGather(card) {
    this.playerDeck.add(card);
  }

  filterOutCitizen(citizens, id) {
    return citizens.filter((citizen) => citizen.id !== id)
  }

  onSelect(card) {
    console.log('select for ', this.user)
    this.selectedCard = card;
    this.db.object(this.divisionPath).update({
      selection: {
        type: 'harvest-tile',
        value: card?.index,
        mark : this.user ? `${this.position}${capitalize(this.name?.[0])}` : ''
      }
    })
  }

  calculateWealth(resources) {
    if (!resources) return 0;
    return resources.reduce((acc, R) => acc + R.value, 0);
  }

  getResourceStatus(card) {
    if (card === undefined) {
      return
    }
    if (!card.harvested) {
      return {
        status: 'explorable'
      }
    } else if (card.value == LandCardValues.CONTAM) {
      return {
        status: 'contaminated',
        message: 'This land is contaminated'
      }
    } else if (card.owner) {
      const ownedBy = card.owner.division == card.owner.name
        ? 'a member of the ' + card.owner.division + ' division'
        : 'player ' + card.owner.name
      return {
        status: 'owned',
        message: 'This land is owned by ' + ownedBy
      }
    }
    return {
      status: 'explored',
    }
  }

  explore() {
    this.landGrid.explore(this.selectedCard, this.id);
    this.actionSheet.dismiss();
  }

  gather() {
    const status = this.selectedResourceStatus?.status;
    if (status === 'explorable' || status === 'explored') {
      this.landGrid.gather(this.selectedCard, this.id)
    }
    this.actionSheet.dismiss();
  }

  addResources(resources) {
    return resources.reduce((acc, R) => acc + R, 0)
  }
}
