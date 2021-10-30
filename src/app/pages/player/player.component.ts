import { Component, ViewChild, OnInit, TemplateRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlayerDeckComponent } from 'src/app/components/player-deck/player-deck.component';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LandGridComponent } from 'src/app/components/land-grid/land-grid.component';
import { takeUntil, take, map } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';
import { toArray, includes, findIndex, filter } from 'lodash';
import { faEye, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const KEY_CODE = {
  e: 69,
  g: 71
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
    if(event.keyCode === KEY_CODE.e){
      this.explore();
    } else if (event.keyCode === KEY_CODE.g) {
      this.gather(); 
    }
  }

  private destroy$ = new Subject<boolean>();

  vote;
  divisionSummaries;
  currentTab = 'Division';
  id;
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
  
  constructor(
    private db: AngularFireDatabase,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const { show, division, id } = this.route.snapshot.params;
    this.showKey = show;
    this.divisionKey = division;
    this.id = id;

    const showPath = `shows/${this.showKey}`;
    this.divisionPath = `${showPath}/divisions/${this.divisionKey}`;
    this.landTilesPath = `${this.divisionPath}/landTiles`;
    this.votePath = `${this.divisionPath}/vote`;

    this.$player = this.db.object(`${this.divisionPath}/citizens/${this.id}`).valueChanges();
    this.$turn = this.db.object(`${this.divisionPath}/turn`).valueChanges();
    this.$division = this.db.object(this.divisionPath).valueChanges();
    this.$citizens = this.db.list(`${this.divisionPath}/citizens`).valueChanges()
      .pipe(
        map((citizens) => filter(citizens, c => c.id !== this.id))
      );
    this.$focus = this.db.object(`${this.divisionPath}/focus`).valueChanges();
    this.$focus.subscribe((focus) => {
      this.focus = focus;
      if (focus === 'principles' || focus === 'resolutions' || focus === 'scenerio') {
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

    this.db.object(`shows/${show}/divisions`)
      .valueChanges()
      .pipe(take(1))
      .subscribe((divisions) => {
        this.createDivisionListeners(divisions)
      })
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
    this.selectedCard = card;
    this.actionSheet = this._bottomSheet.open(this.sheetTemplate);
    this.selectedResourceStatus = this.getResourceStatus(card);
    this.db.object(this.divisionPath).update({
      selection: {
        type: 'harvest-tile',
        value: card?.index
      }
    })
    this.actionSheet.afterDismissed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedCard) {
          this.landGrid.clearSelection(this.selectedCard.index)
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
    console.log('explore');
    this.landGrid.explore(this.selectedCard, true);
    this.actionSheet.dismiss();
  }

  gather() {
    const status = this.selectedResourceStatus?.status;
    if (status === 'explorable' || status === 'explored') {
      this.landGrid.gather(this.selectedCard, true)
    }
    this.actionSheet.dismiss();
  }

  addResources(resources) {
    return resources.reduce((acc, R) => acc + R, 0)
  }
}
