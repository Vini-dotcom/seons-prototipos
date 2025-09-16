import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'logistics-ops',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, NgChartsModule],
  templateUrl: './logistics-ops.component.html',
  styleUrls: ['./logistics-ops.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogisticsOpsComponent {
  private readonly data = inject(DashboardDataService);
  stock$ = this.data.getStockRiskProducts();
  consolidation$ = this.data.getConsolidationSummary();
  idle$ = this.data.getStageIdleTimes();
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };
  buildConsolidationData(series: number[]): ChartData<'bar'> {
    return {
      labels: series.map((_, i) => i + 1 as any),
      datasets: [{ data: series, label: 'Consolidados' }],
    };
  }
  buildIdleData(items: { etapa: string; dias: number }[]): ChartData<'bar'> {
    return {
      labels: items.map((i) => i.etapa as any),
      datasets: [{ data: items.map((i) => i.dias), label: 'Dias' }],
    };
  }
}


