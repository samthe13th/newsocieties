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

const components = [
  AnnouncementComponent,
  CardComponent,
  DialogComponent,
  HarvestComponent,
  PlayerHandsComponent,
  ScorecardComponent,
  SocietySummaryComponent,
  VoteComponent
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ]
})
export class ComponentsModule { }
