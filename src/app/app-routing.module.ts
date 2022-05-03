import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './pages/player/player.component'
import { CentralComponent } from './pages/central/central.component';
import { HostComponent } from './pages/host/host.component';
import { AdminComponent } from './pages/admin/admin.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { ReviewComponent } from './pages/review/review.component';

const routes: Routes = [
  { path: ':show/player/:division', component: PlayerComponent },
  { path: ':show/player/:division/:id', component: PlayerComponent },
  { path: ':show/host/:division', component: HostComponent },
  { path: ':show/admin', component: AdminComponent },
  { path: ':show/central', component: CentralComponent },
  { path: ':show/summary', component: SummaryComponent },
  { path: ':show/review/:division', component: ReviewComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
