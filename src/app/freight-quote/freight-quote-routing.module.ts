import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewQuoteComponent } from './pages/new-quote/new-quote.component';
import { CompareComponent } from './pages/compare/compare.component';

const routes: Routes = [
  { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: 'new', component: NewQuoteComponent },
  { path: 'compare', component: CompareComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FreightQuoteRoutingModule {}



