import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

type Kpi = {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: 'primary' | 'accent' | 'warn' | 'success' | 'warning' | 'error';
};

@Component({
  selector: 'kpi-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './kpi-cards.component.html',
  styleUrls: ['./kpi-cards.component.scss'],
})
export class KpiCardsComponent {
  kpis: Kpi[] = [
    { title: 'Processos em andamento', value: '128 (64%)', icon: 'pending_actions', color: 'accent' },
    { title: 'Processos finalizados (30d)', value: '187', icon: 'check_circle', color: 'primary' },
    { title: 'Tempo médio liberação', value: '4.2 dias', icon: 'schedule', color: 'accent' },
    { title: 'Prazo médio entrega', value: '12.5 dias', icon: 'local_shipping', color: 'accent' },
    { title: 'Taxa de atraso', value: '7.4%', icon: 'warning', color: 'warn' },
    { title: 'Custo médio por processo', value: 'R$ 12.340', icon: 'attach_money', color: 'primary' },
  ];
}



