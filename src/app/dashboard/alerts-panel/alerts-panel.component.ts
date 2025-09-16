import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type Alert = { title: string; description: string; action: string; icon: string };

@Component({
  selector: 'alerts-panel',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './alerts-panel.component.html',
  styleUrls: ['./alerts-panel.component.scss'],
})
export class AlertsPanelComponent {
  alerts: Alert[] = [
    { title: 'Vencimento próximo', description: 'PRC-2025-0007 vence em 2 dias', action: 'Abrir processo', icon: 'event' },
    { title: 'Documento pendente', description: 'Fatura comercial ausente — PRC-2025-0011', action: 'Solicitar documento', icon: 'description' },
    { title: 'Aumento de custo', description: 'Produto Eletrônicos +12% vs média', action: 'Ver análise', icon: 'trending_up' },
  ];
}



