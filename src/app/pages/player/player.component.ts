import { Component, ViewChild, OnInit, TemplateRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlayerDeckComponent } from 'src/app/components/player-deck/player-deck.component';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LandGridComponent } from 'src/app/components/land-grid/land-grid.component';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';
import { toArray, includes, findIndex, toNumber } from 'lodash';
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
  vote;

  divisionSummaries;

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
  currentTab = 'Division';
  id;
  divisionKey = 'N';
  divisionData;
  showKey;
  selectedResourceStatus;
  actionSheet;
  selectedCard;
  voteSelection;
  focus;
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
    const showPath = `shows/${show}`;
    this.showKey = show;
    this.divisionKey = division;
    this.id = id;
    this.landTilesPath = `${showPath}/divisions/${division}/landTiles`;
    this.votePath = `${showPath}/divisions/${division}/vote`;
    
    this.$division = this.db.object(`shows/${show}/divisions/${division}`).valueChanges();
    this.$focus = this.db.object(`shows/${show}/divisions/${division}/focus`).valueChanges();
    this.$focus.subscribe((focus) => {
      console.log({focus});
      this.focus = focus;
      if (focus === 'vote') {
        this.db.object(`shows/${show}/divisions/${division}/vote`)
          .valueChanges()
          .subscribe((vote: any) => {
            this.vote = { ...vote };
            if (includes(JSON.parse(this.vote?.voted), this.id)) {
              this.hasVoted = true;
            } else {
              this.hasVoted = false;
            }
            console.log('player: this.vote... ', this.vote)
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
    console.log("selection: ", this.voteSelection, this.vote);
  }

  castVote() {
    if (this.voteSelection !== undefined) {
      console.log("vote: ", this.voteSelection, this.vote.options[this.voteSelection]);
      this.vote.options[this.voteSelection].votes += 1;
      const voted = JSON.parse(this.vote.voted)
      voted.push(this.id);
      console.log('push vote: ', this.vote, voted)
      this.db.object(`shows/${this.showKey}/divisions/${this.divisionKey}/vote`).set({
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
    return citizens.filter((citizen) => citizen.id !== toNumber(id))
  }

  onSelect(card) {
    this.selectedCard = card;
    this.actionSheet = this._bottomSheet.open(this.sheetTemplate);
    this.selectedResourceStatus = this.getResourceStatus(card);
    this.actionSheet.afterDismissed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedCard) {
          this.landGrid.clearSelection(this.selectedCard.index)
        }
      })
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

  buy(item) {
    this.playerDeck.spend(item.cost);
  }

  explore() {
    console.log('explore');
    this.landGrid.explore(this.selectedCard);
    this.actionSheet.dismiss();
  }

  gather() {
    const status = this.selectedResourceStatus?.status;
    if (status === 'explorable' || status === 'explored') {
      this.landGrid.gather(this.selectedCard)
    }
    this.actionSheet.dismiss();
  }

  addResources(resources) {
    return resources.reduce((acc, R) => acc + R, 0)
  }
}
