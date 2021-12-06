import { NgModule } from '@angular/core';
import { HostComponent } from './host/host.component';
import { CentralComponent } from './central/central.component';
import { PlayerComponent } from './player/player.component';
import { ComponentsModule } from '../components/components.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberPickerModule } from 'ng-number-picker';
import { AdminComponent } from './admin/admin.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { SummaryComponent } from './summary/summary.component';


const pages = [
  CentralComponent,
  HostComponent,
  PlayerComponent, 
  AdminComponent,
  SummaryComponent
]

@NgModule({
  imports: [
    ComponentsModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    NumberPickerModule,
    ReactiveFormsModule,
    GoogleChartsModule,
  ],
  declarations: [
    ...pages
  ],
  exports: [
    ...pages
  ]
})
export class PagesModule { }
