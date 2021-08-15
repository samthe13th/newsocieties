import { Component, ViewChild, OnInit, TemplateRef, HostListener } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { PlayerDeckComponent } from 'src/app/components/player-deck/player-deck.component';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LandGridComponent } from 'src/app/components/land-grid/land-grid.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LandCardValues } from 'src/app/interfaces';
import { faEye, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

const KEY_CODE = {
  e: 69,
  g: 71
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @ViewChild(PlayerDeckComponent, { static: false }) playerDeck: PlayerDeckComponent;
  @ViewChild(LandGridComponent, { static: false }) landGrid: LandGridComponent;
  @ViewChild(TemplateRef, { static: false }) sheetTemplate: TemplateRef<any>;
  
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.keyCode === KEY_CODE.e){
      this.explore();
    } else if (event.keyCode === KEY_CODE.g) {
      this.gather(); 
    }
  }

  private destroy$ = new Subject<boolean>();

  id;
  division = 'N';
  divisionData;
  showId;
  landTilesPath;
  selectedResourceStatus;
  actionSheet;
  selectedCard;

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
    this.showId = show;
    this.id = id;
    this.landTilesPath = `${showPath}/divisions/${division}/landTiles`
  }

  onGather(card) {
    this.playerDeck.add(card);
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
}
