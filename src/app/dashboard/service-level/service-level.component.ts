import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'service-level',
  standalone: true,
  imports: [CommonModule, MatCardModule, NgChartsModule],
  templateUrl: './service-level.component.html',
  styleUrls: ['./service-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLevelComponent {
  private readonly data = inject(DashboardDataService);
  kpis$ = this.data.getServiceLevelKPIs();
  tickets$ = this.data.getTicketsSeries();
  satisfaction$ = this.data.getSatisfactionSeries();
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };
  lineOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };
}



