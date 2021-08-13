import { NgModule } from '@angular/core';
import { HostComponent } from './host/host.component';
import { CentralComponent } from './central/central.component';
import { PlayerComponent } from './player/player.component';
import { ComponentsModule } from '../components/components.module';
import { CommonModule } from '@angular/common';

const pages = [
  CentralComponent,
  HostComponent,
  PlayerComponent
]

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
  ],
  declarations: [
    ...pages
  ],
  exports: [
    ...pages
  ]
})
export class PagesModule { }
