import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './pages/player/player.component'
import { CentralComponent } from './pages/central/central.component';
import { HostComponent } from './pages/host/host.component';

const routes: Routes = [
  { path: ':show/:division/:id', component: PlayerComponent },
  { path: ':show/:division', component: HostComponent },
  { path: '', component: CentralComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
