import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';

export type ProcessStatus = 'ok' | 'em-andamento' | 'finalizado' | 'atencao' | 'atrasado';

export interface ProcessItem {
  id: string;
  produto: string;
  fornecedor: string;
  origem: { porto: string; pais: string };
  destino: { cidade: string; pais: string };
  status: ProcessStatus;
  embarquePrevisto: Date;
  embarqueReal?: Date;
  chegadaPrevista: Date;
  chegadaReal?: Date;
  desembaracoPrevisto: Date;
  desembaracoReal?: Date;
  entregaPrevista: Date;
  entregaReal?: Date;
  custos: { data: Date; valorBRL: number }[]; // histórico mensal
  pendencias: number;
}

export interface GlobalFilters {
  start: Date;
  end: Date;
  status: 'todos' | ProcessStatus;
  product: 'todos' | string;
  fornecedor: 'todos' | string;
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly filtersSubject = new BehaviorSubject<GlobalFilters>({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1),
    end: new Date(),
    status: 'todos',
    product: 'todos',
    fornecedor: 'todos',
  });
  readonly filters$ = this.filtersSubject.asObservable();

  private readonly processos: ProcessItem[];

  private readonly fornecedores = [
    'GlobalTrade SA',
    'Oceanic Ltd',
    'Mercurio Corp',
    'Atlas Log',
    'BluePort',
    'Nova Import',
    'PrimeCargo',
    'Sunrise Intl',
  ];

  private readonly portos = [
    { porto: 'Shanghai', pais: 'China' },
    { porto: 'Shenzhen', pais: 'China' },
    { porto: 'Rotterdam', pais: 'Holanda' },
    { porto: 'Santos', pais: 'Brasil' },
    { porto: 'Hamburgo', pais: 'Alemanha' },
    { porto: 'Los Angeles', pais: 'EUA' },
  ];

  private readonly produtos = [
    'Eletrônicos',
    'Têxteis',
    'Automotivo',
    'Farmacêutico',
    'Alimentos',
    'Químicos',
    'Mecânicos',
    'Plásticos',
    'Aço',
    'Outros',
  ];

  constructor() {
    this.processos = this.generateMockProcesses(55);
  }

  // Filters API
  setFilters(partial: Partial<GlobalFilters>): void {
    const merged = { ...this.filtersSubject.value, ...partial };
    this.filtersSubject.next(merged);
  }

  // Helpers
  private generateMockProcesses(count: number): ProcessItem[] {
    const list: ProcessItem[] = [];
    const now = new Date();
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    for (let i = 0; i < count; i++) {
      const fornecedor = this.fornecedores[rand(0, this.fornecedores.length - 1)];
      const produto = this.produtos[rand(0, this.produtos.length - 1)];
      const origem = this.portos[rand(0, this.portos.length - 1)];
      const destino = { cidade: 'São Paulo', pais: 'Brasil' };
      const mesesAtras = rand(0, 11);
      const base = new Date(now.getFullYear(), now.getMonth() - mesesAtras, rand(1, 25));

      const diasEmbarqueParaChegada = rand(10, 25);
      const diasChegadaParaDesembaraco = rand(2, 8);
      const diasDesembaracoParaEntrega = rand(3, 10);

      const embarquePrevisto = new Date(base);
      const chegadaPrevista = new Date(base.getTime() + diasEmbarqueParaChegada * 86400000);
      const desembaracoPrevisto = new Date(chegadaPrevista.getTime() + diasChegadaParaDesembaraco * 86400000);
      const entregaPrevista = new Date(desembaracoPrevisto.getTime() + diasDesembaracoParaEntrega * 86400000);

      const atrasoDias = rand(-2, 7);
      const embarqueReal = rand(0, 1) ? new Date(embarquePrevisto.getTime() + rand(-1, 3) * 86400000) : undefined;
      const chegadaReal = rand(0, 1) ? new Date(chegadaPrevista.getTime() + atrasoDias * 86400000) : undefined;
      const desembaracoReal = rand(0, 1) ? new Date((chegadaReal ?? chegadaPrevista).getTime() + (diasChegadaParaDesembaraco + rand(-1, 4)) * 86400000) : undefined;
      const entregaReal = rand(0, 1) ? new Date((desembaracoReal ?? desembaracoPrevisto).getTime() + (diasDesembaracoParaEntrega + rand(-2, 5)) * 86400000) : undefined;

      let status: ProcessStatus = 'em-andamento';
      if (entregaReal) status = 'finalizado';
      else if (chegadaReal && new Date() > entregaPrevista) status = 'atrasado';
      else status = rand(0, 100) > 80 ? 'atencao' : 'em-andamento';

      const custos = Array.from({ length: 12 }, (_, m) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - m), 1);
        const baseCost = 9000 + rand(-1500, 2000) + (produto === 'Eletrônicos' ? 1500 : 0);
        return { data: d, valorBRL: Math.max(3000, baseCost) };
      });

      list.push({
        id: `PRC-${now.getFullYear()}-${(1000 + i).toString().padStart(4, '0')}`,
        produto,
        fornecedor,
        origem,
        destino,
        status,
        embarquePrevisto,
        embarqueReal,
        chegadaPrevista,
        chegadaReal,
        desembaracoPrevisto,
        desembaracoReal,
        entregaPrevista,
        entregaReal,
        custos,
        pendencias: rand(0, 3),
      });
    }
    return list;
  }

  private applyFilters(processos: ProcessItem[], f: GlobalFilters): ProcessItem[] {
    return processos.filter((p) => {
      const inPeriod = p.embarquePrevisto >= f.start && p.entregaPrevista <= f.end;
      const statusOk = f.status === 'todos' || p.status === f.status;
      const productOk = f.product === 'todos' || p.produto === f.product;
      const fornecedorOk = f.fornecedor === 'todos' || p.fornecedor === f.fornecedor;
      return inPeriod && statusOk && productOk && fornecedorOk;
    });
  }

  // Public data selectors
  getSuppliersList(): Observable<string[]> { return of(this.fornecedores.slice()); }
  getProductsList(): Observable<string[]> { return of(this.produtos.slice()); }

  getSupplierPerformance(): Observable<{ fornecedor: string; onTimePct: number; atrasoMedioDias: number }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const bySupplier = new Map<string, { total: number; onTime: number; atrasoAcum: number }>();
        list.forEach((p) => {
          const key = p.fornecedor;
          const hit = bySupplier.get(key) ?? { total: 0, onTime: 0, atrasoAcum: 0 };
          hit.total++;
          const atraso = (p.entregaReal ? (p.entregaReal.getTime() - p.entregaPrevista.getTime()) : 0) / 86400000;
          hit.atrasoAcum += Math.max(0, Math.round(atraso));
          if (!p.entregaReal || p.entregaReal <= p.entregaPrevista) hit.onTime++;
          bySupplier.set(key, hit);
        });
        return Array.from(bySupplier.entries()).map(([fornecedor, v]) => ({
          fornecedor,
          onTimePct: v.total ? Math.round((v.onTime / v.total) * 100) : 0,
          atrasoMedioDias: v.total ? +(v.atrasoAcum / v.total).toFixed(1) : 0,
        })).sort((a, b) => b.onTimePct - a.onTimePct);
      })
    );
  }

  getPortClearancePerformance(): Observable<{ porto: string; pais: string; tempoMedioDias: number }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const byPort = new Map<string, { total: number; soma: number; porto: string; pais: string }>();
        list.forEach((p) => {
          const key = `${p.origem.porto}|${p.origem.pais}`;
          const chegada = p.chegadaReal ?? p.chegadaPrevista;
          const desemb = p.desembaracoReal ?? p.desembaracoPrevisto;
          const tempo = (desemb.getTime() - chegada.getTime()) / 86400000;
          const hit = byPort.get(key) ?? { total: 0, soma: 0, porto: p.origem.porto, pais: p.origem.pais };
          hit.total++;
          hit.soma += Math.max(0, Math.round(tempo));
          byPort.set(key, hit);
        });
        return Array.from(byPort.values()).map((x) => ({ porto: x.porto, pais: x.pais, tempoMedioDias: +(x.soma / x.total).toFixed(1) }))
          .sort((a, b) => a.tempoMedioDias - b.tempoMedioDias);
      })
    );
  }

  getStageDurations(): Observable<{ label: string; embarqueChegada: number; chegadaDesembaraco: number; desembaracoEntrega: number }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => list.slice(0, 10).map((p) => ({
        label: p.id,
        embarqueChegada: Math.max(1, Math.round(((p.chegadaReal ?? p.chegadaPrevista).getTime() - (p.embarqueReal ?? p.embarquePrevisto).getTime()) / 86400000)),
        chegadaDesembaraco: Math.max(0, Math.round(((p.desembaracoReal ?? p.desembaracoPrevisto).getTime() - (p.chegadaReal ?? p.chegadaPrevista).getTime()) / 86400000)),
        desembaracoEntrega: Math.max(0, Math.round(((p.entregaReal ?? p.entregaPrevista).getTime() - (p.desembaracoReal ?? p.desembaracoPrevisto).getTime()) / 86400000)),
      })))
    );
  }

  getOnTimeRateSeries(periodo: 6 | 12): Observable<{ labels: string[]; values: number[] }> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const months = periodo;
        const now = new Date();
        const labels: string[] = [];
        const values: number[] = [];
        for (let i = months - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(`${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`);
          const monthItems = list.filter((p) => (p.entregaReal ?? p.entregaPrevista).getMonth() === d.getMonth());
          const total = monthItems.length || 1;
          const onTime = monthItems.filter((p) => !p.entregaReal || p.entregaReal <= p.entregaPrevista).length;
          values.push(Math.round((onTime / total) * 100));
        }
        return { labels, values };
      })
    );
  }

  getDelayHeatmap(): Observable<number[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const now = new Date();
        const arr = Array.from({ length: 12 }, (_, i) => {
          const m = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1).getMonth();
          const atrasos = list.filter((p) => p.status === 'atrasado' && (p.chegadaReal ?? p.chegadaPrevista).getMonth() === m).length;
          return atrasos;
        });
        return arr;
      })
    );
  }

  getArrivalPredictions(): Observable<{ id: string; fornecedor: string; etaPrevista: Date; desvioEsperadoDias: number; risco: 'baixa' | 'media' | 'alta' }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => list.filter((p) => p.status === 'em-andamento' || p.status === 'atencao')),
      map((list) => list.slice(0, 12).map((p) => {
        const mediaFornecedor = 5 + (p.fornecedor.charCodeAt(0) % 4);
        const mediaPorto = 4 + (p.origem.porto.charCodeAt(0) % 3);
        const desvio = Math.max(0, (p.pendencias % 3) + (mediaFornecedor + mediaPorto) / 4);
        const riscoVal = desvio > 6 ? 'alta' : desvio > 3.5 ? 'media' : 'baixa';
        return {
          id: p.id,
          fornecedor: p.fornecedor,
          etaPrevista: new Date((p.desembaracoReal ?? p.desembaracoPrevisto).getTime() + (3 + mediaFornecedor) * 86400000),
          desvioEsperadoDias: +desvio.toFixed(1),
          risco: riscoVal,
        };
      }))
    );
  }

  getCostForecast(): Observable<{ labels: string[]; values: number[] }> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const now = new Date();
        const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}/${String(now.getFullYear()).slice(-2)}`);
        const values = labels.map((_, idx) => {
          const monthItems = list.flatMap((p) => p.custos.filter((c) => c.data.getMonth() === idx));
          const avg = monthItems.length ? monthItems.reduce((s, c) => s + c.valorBRL, 0) / monthItems.length : 10000;
          const fx = 1 + ((idx % 4) - 1) * 0.03; // mock câmbio
          return Math.round(avg * fx);
        });
        return { labels, values };
      })
    );
  }

  getStockRiskProducts(): Observable<{ produto: string; estoqueAtual: number; consumoMedio: number; etaProximoDias: number; severidade: 'baixa' | 'media' | 'alta' }[]> {
    return this.filters$.pipe(
      map(() => this.produtos.slice(0, 8).map((p, i) => {
        const estoque = 100 - i * 9;
        const consumo = 20 + (i * 3);
        const eta = 7 + (i % 4) * 3;
        const severidade = estoque / consumo < 2 ? 'alta' : estoque / consumo < 3 ? 'media' : 'baixa';
        return { produto: p, estoqueAtual: estoque, consumoMedio: consumo, etaProximoDias: eta, severidade };
      }))
    );
  }

  getConsolidationSummary(): Observable<{ totalConsolidados: number; pctTotal: number; economiaFrete: number; serie: number[] }> {
    return this.filters$.pipe(
      map(() => ({
        totalConsolidados: 18,
        pctTotal: 0.32,
        economiaFrete: 185000,
        serie: Array.from({ length: 12 }, () => 10 + Math.floor(Math.random() * 20)),
      }))
    );
  }

  getStageIdleTimes(): Observable<{ etapa: string; dias: number }[]> {
    return this.filters$.pipe(
      map(() => [
        { etapa: 'Porto', dias: 4.2 },
        { etapa: 'Armazém', dias: 2.6 },
        { etapa: 'Transporte', dias: 5.1 },
      ])
    );
  }

  getServiceLevelKPIs(): Observable<{ tempoMedioRespostaHoras: number; satisfacaoMedia: number }> {
    return this.filters$.pipe(map(() => ({ tempoMedioRespostaHoras: 5.4, satisfacaoMedia: 4.3 })));
  }

  getTicketsSeries(): Observable<{ labels: string[]; abertos: number[]; resolvidos: number[] }> {
    return this.filters$.pipe(
      map(() => {
        const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
        const abertos = labels.map(() => 30 + Math.floor(Math.random() * 15));
        const resolvidos = labels.map((_, i) => abertos[i] - Math.floor(Math.random() * 5));
        return { labels, abertos, resolvidos };
      })
    );
  }

  getSatisfactionSeries(): Observable<{ labels: string[]; notas: number[] }> {
    return this.filters$.pipe(
      map(() => {
        const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
        const notas = labels.map(() => +(3.5 + Math.random() * 1.2).toFixed(2));
        return { labels, notas };
      })
    );
  }

  getTopRoutes(): Observable<{ origem: string; destino: string; total: number; ok: number; atencao: number; critico: number }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const mapKey = new Map<string, { total: number; ok: number; atencao: number; critico: number; origem: string; destino: string }>();
        list.forEach((p) => {
          const key = `${p.origem.porto}->${p.destino.cidade}`;
          const hit = mapKey.get(key) ?? { total: 0, ok: 0, atencao: 0, critico: 0, origem: p.origem.porto, destino: p.destino.cidade };
          hit.total++;
          if (p.status === 'ok' || p.status === 'finalizado') hit.ok++; else if (p.status === 'atencao') hit.atencao++; else hit.critico++;
          mapKey.set(key, hit);
        });
        return Array.from(mapKey.values()).sort((a, b) => b.total - a.total).slice(0, 5);
      })
    );
  }

  getOriginsSummary(): Observable<{ origem: string; pais: string; total: number; ok: number; atencao: number; critico: number; principalDestino: string }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const byOrigin = new Map<string, { total: number; ok: number; atencao: number; critico: number; origem: string; pais: string; destinos: Record<string, number> }>();
        list.forEach((p) => {
          const key = `${p.origem.porto}|${p.origem.pais}`;
          const hit = byOrigin.get(key) ?? { total: 0, ok: 0, atencao: 0, critico: 0, origem: p.origem.porto, pais: p.origem.pais, destinos: {} };
          hit.total++;
          if (p.status === 'ok' || p.status === 'finalizado') hit.ok++; else if (p.status === 'atencao') hit.atencao++; else hit.critico++;
          hit.destinos[p.destino.cidade] = (hit.destinos[p.destino.cidade] ?? 0) + 1;
          byOrigin.set(key, hit);
        });
        return Array.from(byOrigin.values()).map((x) => ({
          origem: x.origem,
          pais: x.pais,
          total: x.total,
          ok: x.ok,
          atencao: x.atencao,
          critico: x.critico,
          principalDestino: Object.entries(x.destinos).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-',
        }));
      })
    );
  }

  getGanttSeries(): Observable<{ labels: string[]; offsets: number[]; duracoes: number[]; cores: string[] }> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => list.slice(0, 12)),
      map((list) => {
        const minStart = Math.min(...list.map((p) => p.embarquePrevisto.getTime()));
        const labels: string[] = [];
        const offsets: number[] = [];
        const duracoes: number[] = [];
        const cores: string[] = [];
        list.forEach((p) => {
          labels.push(p.id);
          const startDays = (p.embarquePrevisto.getTime() - minStart) / 86400000;
          const end = (p.entregaReal ?? p.entregaPrevista).getTime();
          const durationDays = (end - p.embarquePrevisto.getTime()) / 86400000;
          offsets.push(+startDays.toFixed(1));
          duracoes.push(+durationDays.toFixed(1));
          const cor = p.status === 'atrasado' ? '#c62828' : p.status === 'atencao' ? '#f9a825' : '#2e7d32';
          cores.push(cor);
        });
        return { labels, offsets, duracoes, cores };
      })
    );
  }

  getAdvancedAlerts(): Observable<{ tipo: string; severidade: 'baixa' | 'media' | 'alta'; titulo: string; descricao: string; processoId?: string }[]> {
    return combineLatest([of(this.processos), this.filters$]).pipe(
      map(([data, f]) => this.applyFilters(data, f)),
      map((list) => {
        const alerts: { tipo: string; severidade: 'baixa' | 'media' | 'alta'; titulo: string; descricao: string; processoId?: string }[] = [];
        list.slice(0, 10).forEach((p, i) => {
          if (p.pendencias > 0) alerts.push({ tipo: 'Documentos', severidade: 'media', titulo: 'Documento pendente', descricao: `${p.id} com ${p.pendencias} pendência(s)`, processoId: p.id });
          if (p.status === 'atrasado') alerts.push({ tipo: 'Prazo', severidade: 'alta', titulo: 'Processo atrasado', descricao: `${p.id} excedeu o prazo previsto`, processoId: p.id });
          if (i % 3 === 0) alerts.push({ tipo: 'Custo', severidade: 'baixa', titulo: 'Variação de custo', descricao: `${p.produto} acima da média no mês` });
        });
        return alerts;
      })
    );
  }
}


