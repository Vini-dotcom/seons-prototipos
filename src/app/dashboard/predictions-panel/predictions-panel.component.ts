import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'predictions-panel',
  standalone: true,
  imports: [CommonModule, DatePipe, MatListModule, MatChipsModule, MatIconModule, MatTooltipModule, NgChartsModule],
  templateUrl: './predictions-panel.component.html',
  styleUrls: ['./predictions-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionsPanelComponent {
  private readonly data = inject(DashboardDataService);
  arrivals$ = this.data.getArrivalPredictions();
  costForecast$ = this.data.getCostForecast();
  lineOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };
}



