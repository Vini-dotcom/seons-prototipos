import { Routes } from '@angular/router';
import { PlaygroundComponent } from './playground/playground.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CostAnalysisPageComponent } from './cost-analysis-page/cost-analysis-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'analise-custos', component: CostAnalysisPageComponent },
  { path: 'freight-quote', loadChildren: () => import('./freight-quote/freight-quote.module').then(m => m.FreightQuoteModule) },
  { path: 'playground', component: PlaygroundComponent },
  { path: '**', redirectTo: 'dashboard' },
];
