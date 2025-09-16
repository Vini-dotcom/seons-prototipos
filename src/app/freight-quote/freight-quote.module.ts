import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FreightQuoteRoutingModule } from './freight-quote-routing.module';

import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgChartsModule } from 'ng2-charts';

import { NewQuoteComponent } from './pages/new-quote/new-quote.component';
import { CompareComponent } from './pages/compare/compare.component';
import { ShipmentFormComponent } from './components/shipment-form/shipment-form.component';
import { ChargesEditorComponent } from './components/charges-editor/charges-editor.component';
import { AgentQuoteCardComponent } from './components/agent-quote-card/agent-quote-card.component';
import { ComparisonTableComponent } from './components/comparison-table/comparison-table.component';
import { DecisionPanelComponent } from './components/decision-panel/decision-panel.component';

@NgModule({
  declarations: [
    NewQuoteComponent,
    CompareComponent,
    ShipmentFormComponent,
    ChargesEditorComponent,
    AgentQuoteCardComponent,
    ComparisonTableComponent,
    DecisionPanelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FreightQuoteRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    NgChartsModule,
  ],
})
export class FreightQuoteModule {}



