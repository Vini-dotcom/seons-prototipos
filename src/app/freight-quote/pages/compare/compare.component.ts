import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compare',
  standalone: false,
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  columns: string[] = ['Agente', 'Custo Total (moeda)', 'Custo Total (USD)', 'Transit Time', 'Transbordo', 'Free Time (O/D)', 'Qtde Taxas', 'Score'];
  rows: any[] = [];

  ngOnInit(): void {
    // Protótipo: preencher com dados vazios; integração futura via serviço/route state
  }

  exportCsv(): void {
    const csv = [this.columns.join(';'), ...this.rows.map(r => this.columns.map(c => r[c]).join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comparacao.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}



