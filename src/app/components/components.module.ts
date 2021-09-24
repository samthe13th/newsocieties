import { NgModule } from '@angular/core';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CardComponent } from './card/card.component';
import { DialogComponent } from './dialog/dialog.component';
import { HarvestComponent } from './harvest/harvest.component';
import { PlayerHandsComponent } from './player-hands/player-hands.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { SocietySummaryComponent } from './society-summary/society-summary.component';
import { SocietyGridComponent } from './society-grid/society-grid.component';
import { VoteComponent } from './vote/vote.component';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerDeckComponent } from './player-deck/player-deck.component';
import { LandGridComponent } from './land-grid/land-grid.component';
import { TabsComponent } from './tabs/tabs.component';
import { ChatComponent } from './chat/chat.component';
import { TemplateIdDirective } from './template-id.directive';

const components = [
  AnnouncementComponent,
  CardComponent,
  ChatComponent,
  DialogComponent,
  HarvestComponent,
  LandGridComponent,
  PlayerHandsComponent,
  PlayerDeckComponent,
  ScorecardComponent,
  SocietyGridComponent,
  SocietySummaryComponent,
  TabsComponent,
  VoteComponent
]

const directives = [
  TemplateIdDirective
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
    ...components,
    ...directives
  ],
  exports: [
    ...components,
    ...directives
  ]
})
export class ComponentsModule { }
