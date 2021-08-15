import { NgModule } from '@angular/core';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CardComponent } from './card/card.component';
import { DialogComponent } from './dialog/dialog.component';
import { HarvestComponent } from './harvest/harvest.component';
import { PlayerHandsComponent } from './player-hands/player-hands.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { SocietySummaryComponent } from './society-summary/society-summary.component';
import { VoteComponent } from './vote/vote.component';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerDeckComponent } from './player-deck/player-deck.component';
import { LandGridComponent } from './land-grid/land-grid.component';

const components = [
  AnnouncementComponent,
  CardComponent,
  DialogComponent,
  HarvestComponent,
  LandGridComponent,
  PlayerHandsComponent,
  PlayerDeckComponent,
  ScorecardComponent,
  SocietySummaryComponent,
  VoteComponent
]

const ngMaterial = [
  MatBottomSheetModule
]

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    ...ngMaterial
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class ComponentsModule { }
