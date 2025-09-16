import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartData } from 'chart.js';
import { DashboardDataService } from '../dashboard-data.service';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'performance-insights',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    NgFor,
    MatTableModule,
    MatSortModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatIconModule,
    NgChartsModule,
  ],
  templateUrl: './performance-insights.component.html',
  styleUrls: ['./performance-insights.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceInsightsComponent {
  readonly data = inject(DashboardDataService);

  suppliers$ = this.data.getSupplierPerformance();
  ports$ = this.data.getPortClearancePerformance();
  stageDurations$ = this.data.getStageDurations();

  periodo: 6 | 12 = 6;
  onTimeSeries$ = this.data.getOnTimeRateSeries(this.periodo);

  setPeriodo(p: 6 | 12) {
    this.periodo = p;
    this.onTimeSeries$ = this.data.getOnTimeRateSeries(this.periodo);
  }

  stackedOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { stacked: true }, y: { stacked: true } },
  };
  buildStackedData(sd: { label: string; embarqueChegada: number; chegadaDesembaraco: number; desembaracoEntrega: number }[]): ChartData<'bar'> {
    return {
      labels: sd.map((s) => s.label as any),
      datasets: [
        { data: sd.map((s) => s.embarqueChegada), label: 'Embarque→Chegada' },
        { data: sd.map((s) => s.chegadaDesembaraco), label: 'Chegada→Desemb.' },
        { data: sd.map((s) => s.desembaracoEntrega), label: 'Desemb.→Entrega' },
      ],
    };
  }
}


