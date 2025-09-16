import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { KpiCardsComponent } from './kpi-cards/kpi-cards.component';
import { FollowUpTableComponent } from './follow-up-table/follow-up-table.component';
import { CostAnalysisComponent } from './cost-analysis/cost-analysis.component';
import { AlertsPanelComponent } from './alerts-panel/alerts-panel.component';
import { DashboardDataService } from './dashboard-data.service';
// Componentes removidos temporariamente (não utilizados no template atual):
// PerformanceInsightsComponent, PredictionsPanelComponent, LogisticsOpsComponent, 
// ServiceLevelComponent, WorldMapComponent

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTooltipModule,
    KpiCardsComponent,
    FollowUpTableComponent,
    CostAnalysisComponent,
    AlertsPanelComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(DashboardDataService);

  filterForm = this.fb.group({
    start: [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)],
    end: [new Date()],
    status: ['todos'],
    product: ['todos'],
    fornecedor: ['todos'],
  });

  readonly statuses = ['todos', 'em-andamento', 'finalizado', 'atrasado'];
  readonly products = ['todos', 'Eletrônicos', 'Têxteis', 'Automotivo', 'Farmacêutico'];
  suppliers$ = this.data.getSuppliersList();

  readonly dateRange = computed(() => ({
    start: this.filterForm.value.start as Date,
    end: this.filterForm.value.end as Date,
  }));

  onExportExcel(): void {
    // Evento repassado para tabela executar export CSV
    const event = new CustomEvent('export-excel');
    window.dispatchEvent(event);
  }

  onExportPdf(): void {
    // Protótipo: apenas feedback
    alert('Exportação para PDF será integrada (protótipo).');
  }

  constructor() {
    this.filterForm.valueChanges.subscribe((val) => {
      const { start, end, status, product, fornecedor } = val;
      this.data.setFilters({
        start: start ?? new Date(),
        end: end ?? new Date(),
        status: (status as any) ?? 'todos',
        product: (product as any) ?? 'todos',
        fornecedor: (fornecedor as any) ?? 'todos',
      });
    });
    // seed initial filters
    const v = this.filterForm.value;
    this.data.setFilters({
      start: v.start!,
      end: v.end!,
      status: v.status as any,
      product: v.product as any,
      fornecedor: v.fornecedor as any,
    });
  }
}


