import { NgModule } from '@angular/core';
import { CardComponent } from './shared/card/card.component';
import { PlayerHandsComponent } from './player/player-hands/player-hands.component';
import { SocietySummaryComponent } from './shared/society-summary/society-summary.component';
import { SocietyGridComponent } from './shared/society-grid/society-grid.component';
import { VoteComponent } from './shared/vote/vote.component';
import { CommonModule } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlayerDeckComponent } from './player/player-deck/player-deck.component';
import { LandGridComponent } from './shared/land-grid/land-grid.component';
import { TabsComponent } from './shared/tabs/tabs.component';
import { ChatComponent } from './shared/chat/chat.component';
import { TemplateIdDirective } from './template-id.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberPickerModule } from 'ng-number-picker';
import { NumberChangeComponent } from './shared/number-change/number-change.component';
import { ButtonGroupComponent } from './shared/button-group/button-group.component';
import { PlayerTurnComponent } from './player/player-turn/player-turn.component';
import { NotificationFeedComponent } from './host/notification-feed/notification-feed.component';
import { ExportsComponent } from './host/exports/exports.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { UsersGridComponent } from './central/users-grid/users-grid.component';
import { DivisionFullComponent } from './central/division-full/division-full.component';
import { ToastComponent } from './shared/toast/toast.component';
import { DivisionPopupsComponent } from './shared/division-popups/division-popups.component';
import { HarvestImageComponent } from './shared/harvest-image/harvest-image.component';
import { PlayerViewControlComponent } from './host/player-view-control/player-view-control.component';
import { NewsFeedComponent } from './host/news-feed/news-feed.component';
import { BannerComponent } from './player/banner/banner.component';
import { ReserveBarComponent } from './player/banner/reserve-bar/reserve-bar.component';
import { PlayerAdvancementsComponent } from './player/player-advancements/player-advancements.component';
import { AdvancementTrackComponent } from './player/player-advancements/advancement-track/advancement-track.component';
import { GlobalLandComponent } from './shared/market/global-land/global-land.component';
import { AdvancementSummaryComponent } from './shared/market/advancement-summary/advancement-summary.component';
import { MarketComponent } from './shared/market/market.component';
import { DivisionReviewComponent } from './shared/division-review/division-review.component';
import { StateComponent } from './shared/state/state.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { DivisionChartComponent } from './shared/division-chart/division-chart.component';
import { LargePopupComponent } from './shared/large-popup/large-popup.component';
import { DemoTilesComponent } from './shared/demo-tiles/demo-tiles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const components = [
  AdvancementTrackComponent,
  AdvancementSummaryComponent,
  ButtonGroupComponent,
  BannerComponent,
  CardComponent,
  ChatComponent,
  DemoTilesComponent,
  DivisionChartComponent,
  DivisionFullComponent,
  DivisionPopupsComponent,
  DivisionReviewComponent,
  ExportsComponent,
  GlobalLandComponent,
  HarvestImageComponent,
  LandGridComponent,
  LargePopupComponent,
  MarketComponent,
  NotificationFeedComponent,
  NewsFeedComponent,
  NumberChangeComponent,
  PlayerAdvancementsComponent,
  PlayerHandsComponent,
  PlayerDeckComponent,
  PlayerTurnComponent,
  PlayerViewControlComponent,
  ReserveBarComponent,
  SocietyGridComponent,
  SocietySummaryComponent,
  StateComponent,
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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    GoogleChartsModule,
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
