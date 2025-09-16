import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-analysis-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cost-analysis-page">
      <h1>Análise de Custos</h1>
      <p>Página de análise de custos em desenvolvimento.</p>
    </div>
  `,
  styleUrls: ['./cost-analysis-page.component.scss']
})
export class CostAnalysisPageComponent {

}
