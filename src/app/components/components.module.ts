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
import { ButtonGroupComponent } from './button-group/button-group.component';
import { PlayerTurnComponent } from './player-turn/player-turn.component';
import { NotificationFeedComponent } from './notification-feed/notification-feed.component';
import { ExportsComponent } from './exports/exports.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { DivisionFullComponent } from './division-full/division-full.component';
import { ToastComponent } from './toast/toast.component';
import { DivisionPopupsComponent } from './division-popups/division-popups.component';
import { HarvestImageComponent } from './harvest-image/harvest-image.component';
import { PlayerViewControlComponent } from './player-view-control/player-view-control.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { BannerComponent } from './banner/banner.component';

const components = [
  AnnouncementComponent,
  ButtonGroupComponent,
  BannerComponent,
  CardComponent,
  ChatComponent,
  DialogComponent,
  DivisionFullComponent,
  DivisionPopupsComponent,
  ExportsComponent,
  FundraisingComponent,
  HarvestImageComponent,
  LandGridComponent,
  NotificationFeedComponent,
  NewsFeedComponent,
  NumberChangeComponent,
  PlayerHandsComponent,
  PlayerDeckComponent,
  PlayerTurnComponent,
  PlayerViewControlComponent,
  ScorecardComponent,
  SocietyGridComponent,
  SocietySummaryComponent,
  TabsComponent,
  ToastComponent,
  UsersGridComponent,
  VoteComponent
]

const directives = [
  TemplateIdDirective,
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
    NgMultiSelectDropDownModule.forRoot(),
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
