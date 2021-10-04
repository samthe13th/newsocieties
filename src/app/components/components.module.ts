import { NgModule } from '@angular/core';
import { AnnouncementComponent } from './announcement/announcement.component';
import { CardComponent } from './card/card.component';
import { DialogComponent } from './dialog/dialog.component';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberPickerModule } from 'ng-number-picker';
import { FundraisingComponent } from './fundraising/fundraising.component';
import { NumberChangeComponent } from './number-change/number-change.component';
 

const components = [
  AnnouncementComponent,
  CardComponent,
  ChatComponent,
  DialogComponent,
  FundraisingComponent,
  LandGridComponent,
  NumberChangeComponent,
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
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
    NumberPickerModule,
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
