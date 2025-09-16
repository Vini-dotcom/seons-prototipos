import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'cost-analysis',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './cost-analysis.component.html',
  styleUrls: ['./cost-analysis.component.scss'],
})
export class CostAnalysisComponent {
  // Bar chart - produtos mais importados
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };
  barLabels = ['Eletrônicos', 'Têxteis', 'Automotivo', 'Farmacêutico', 'Outros'];
  barDatasets: ChartConfiguration<'bar'>['data']['datasets'] = [
    { data: [120, 80, 60, 40, 30], label: 'Quantidade' },
    { data: [1200, 850, 900, 700, 400], label: 'Valor (k R$)', yAxisID: 'y1' },
  ];

  // Line chart - evolução custo médio por produto (12 meses)
  lineOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };
  lineLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}/25`);
  lineDatasets: ChartConfiguration<'line'>['data']['datasets'] = [
    { data: [10, 11, 12, 13, 12, 11, 12, 13, 14, 13, 12, 11], label: 'Eletrônicos' },
    { data: [8, 8.5, 8.2, 8.4, 8.8, 8.6, 8.9, 9.1, 8.7, 8.5, 8.3, 8.0], label: 'Têxteis' },
  ];

  // Pie chart - proporção de impostos
  pieOptions: ChartOptions<'pie'> = { responsive: true, maintainAspectRatio: false };
  pieLabels = ['ICMS', 'II', 'PIS/COFINS', 'Outros'];
  pieDatasets = [{ data: [35, 25, 30, 10] }];
}



