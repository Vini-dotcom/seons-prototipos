import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

type Processo = {
  id: string;
  status: 'ok' | 'atencao' | 'atrasado';
  dataEmbarque: string;
  dataChegada: string;
  dataPrevistaEntrega: string;
  pendencias: number;
  responsavel: string;
  historico: string[];
};

@Component({
  selector: 'follow-up-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatBadgeModule,
    MatExpansionModule,
    MatButtonModule,
  ],
  templateUrl: './follow-up-table.component.html',
  styleUrls: ['./follow-up-table.component.scss'],
})
export class FollowUpTableComponent implements OnInit, OnDestroy {
  displayedColumns = ['processo', 'status', 'embarque', 'chegada', 'prevista', 'pendencias'];
  data: Processo[] = [
    {
      id: 'PRC-2025-0001', status: 'ok', dataEmbarque: '2025-07-01', dataChegada: '2025-07-15',
      dataPrevistaEntrega: '2025-07-20', pendencias: 0, responsavel: 'Ana Lima', historico: ['Criado', 'Despacho OK']
    },
    {
      id: 'PRC-2025-0002', status: 'atencao', dataEmbarque: '2025-07-03', dataChegada: '2025-07-18',
      dataPrevistaEntrega: '2025-07-26', pendencias: 2, responsavel: 'Carlos Souza', historico: ['Aguardando DI', 'Conferência']
    },
    {
      id: 'PRC-2025-0003', status: 'atrasado', dataEmbarque: '2025-06-28', dataChegada: '2025-07-10',
      dataPrevistaEntrega: '2025-07-14', pendencias: 1, responsavel: 'Marina Nunes', historico: ['Atraso porto', 'Reprogramado']
    },
  ];

  ngOnInit(): void {
    window.addEventListener('export-excel', this.exportCsv);
  }

  ngOnDestroy(): void {
    window.removeEventListener('export-excel', this.exportCsv);
  }

  exportCsv = () => {
    const headers = ['Processo', 'Status', 'Data Embarque', 'Data Chegada', 'Data Prevista Entrega', 'Pendências'];
    const rows = this.data.map(d => [d.id, d.status, d.dataEmbarque, d.dataChegada, d.dataPrevistaEntrega, String(d.pendencias)]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'followup.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
}



