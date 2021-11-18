import { Component, ViewChild, OnInit, TemplateRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlayerDeckComponent } from 'src/app/components/player-deck/player-deck.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LandGridComponent } from 'src/app/components/land-grid/land-grid.component';
import { takeUntil, take, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';
import { toArray, includes, findIndex, filter } from 'lodash';
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
  $focus; 
  $turn;
  $citizens;
  $player;

  @ViewChild(PlayerDeckComponent, { static: false }) playerDeck: PlayerDeckComponent;
  @ViewChild(LandGridComponent, { static: false }) landGrid: LandGridComponent;
  @ViewChild('tileSelectSheet', { static: false }) sheetTemplate: TemplateRef<any>;
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.enter && !this.name) {
      console.log("ENTER");
      this.setName();
    }
    // if(event.keyCode === KEY_CODE.e){
    //   this.explore();
    // } else if (event.keyCode === KEY_CODE.g) {
    //   this.gather(); 
    // }
  }

  private destroy$ = new Subject<boolean>();

  nameInput; 

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
  hasVoted = false;

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
    this.db.object(`shows/${this.showKey}/users`).valueChanges()
      .pipe(take(1))
      .subscribe((users) => {
      this.user = users[id];
      console.log('USER: ', this.user)
      this.name = this.user?.name;
   })
    console.log("ID: ", id)
    if (id) {
      console.log('SIGNED IN')
      this.id = id;
      this.signedIn = true;
    }

    const showPath = `shows/${this.showKey}`;
    this.divisionPath = `${showPath}/divisions/${this.divisionKey}`;
    this.landTilesPath = `${this.divisionPath}/landTiles`;
    this.votePath = `${this.divisionPath}/vote`;
    this.$division = this.db.object(this.divisionPath).valueChanges();

    this.db.object(`shows/${show}/divisions`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((divisions) => {
        this.createDivisionListeners(divisions)
      })
  }

  signIn(code) {
    this.loginValidations = [];
    if (code === 'ns-host') {
      this.router.navigate([this.showKey, 'host', this.divisionKey]);
    } else {
      this.db.object(`shows/${this.showKey}/users`).valueChanges().pipe(take(1)).subscribe((users) => {
        this.user = users[code];
        console.log('user: ', this.user)
  
        if (!this.user) {
          this.loginValidations.push("Sorry, this code is not correct");
        }
        if (this.loginValidations.length === 0) {
          this.db.object(`shows/${this.showKey}/users/${code}`).update(
            { division: this.divisionKey }
          ).then((x) => {
            console.log('redirect: ', this.user);
            this.navigateToPlayerPage(code);
            // const name = users[code]?.name;
            // if (name) {
            //   this.continueToDivision(code, name);
            // } else {
            //   this.id = code;
            //   console.log("set: ", this.id, this.divisionKey);
            // }
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
    console.log("continue... ", code, name, this.user, this.divisionKey);
    this.name = name;
    if (this.user?.division === this.divisionKey || !this.user?.division) {
      console.log('join division: ', this.divisionKey)
      this.joinDivision(code, name);
    } else {
      console.log('transfer from division: ', this.user.division, ' to: ', this.divisionKey)
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
    this.$player = this.db.object(`${this.divisionPath}/citizens/${this.id}`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges();
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        map((citizens) => filter(citizens, c => c.id !== this.id))
      );
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges();
    this.$focus.subscribe((focus) => {
      this.focus = focus;
      if (focus === 'principles' || focus === 'resolutions' || focus === 'scenario') {
        this.db.object(`${this.divisionPath}/vote`)
          .valueChanges()
          .subscribe((vote: any) => {
            this.vote = { ...vote };
            if (includes(JSON.parse(this.vote?.voted), this.id)) {
              this.hasVoted = true;
            } else {
              this.hasVoted = false;
            }
          })
      }
    })
  }

  navigateToPlayerPage(code) {
    this.router.navigate([this.showKey, 'player', this.divisionKey, code]);
  }

  onSelectionChange({ vote, selection }) {
    this.vote = vote;
    this.voteSelection = findIndex(this.vote.options, ["prompt", selection.prompt]);
  }

  castVote() {
    if (this.voteSelection !== undefined) {
      this.vote.options[this.voteSelection].votes += 1;
      const voted = JSON.parse(this.vote.voted)
      voted.push(this.id);
      this.db.object(`${this.divisionPath}/vote`).set({
        ...this.vote,
        voted: JSON.stringify(voted)
      }).then(() => {
        this.hasVoted = true;
      })
    }
  }

  createDivisionListeners(divisions) {
    this.divisionSummaries = toArray(divisions).map(division => {
      return this.db.object(`shows/${this.showKey}/divisions/${division.code}`).valueChanges();
    })
    console.log('divisions: ', this.divisionSummaries);
  }

  onGather(card) {
    this.playerDeck.add(card);
  }

  filterOutCitizen(citizens, id) {
    return citizens.filter((citizen) => citizen.id !== id)
  }

  onSelect(card) {
    console.log('users: ', )
    this.selectedCard = card;
    // this.actionSheet = this._bottomSheet.open(this.sheetTemplate);
    // this.selectedResourceStatus = this.getResourceStatus(card);
    this.db.object(this.divisionPath).update({
      selection: {
        type: 'harvest-tile',
        value: card?.index,
        mark : this.user ? this.user?.name[0] : ''
      }
    })
    // this.actionSheet.afterDismissed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     if (this.selectedCard) {
    //       this.landGrid.clearSelection(this.selectedCard.index)
    //     }
    //   })
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
    console.log('explore');
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
