import { NgModule } from '@angular/core';
import { HostComponent } from './host/host.component';
import { CentralComponent } from './central/central.component';
import { PlayerComponent } from './player/player.component';
import { ComponentsModule } from '../components/components.module';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberPickerModule } from 'ng-number-picker';


const pages = [
  CentralComponent,
  HostComponent,
  PlayerComponent
]

@NgModule({
  imports: [
    ComponentsModule,
    FontAwesomeModule,
    CommonModule,
    FormsModule,
    NumberPickerModule,
    ReactiveFormsModule
  ],
  declarations: [
    ...pages
  ],
  exports: [
    ...pages
  ]
})
export class PagesModule { }
