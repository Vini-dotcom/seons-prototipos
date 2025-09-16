import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Agent } from '../models/agent.model';
import { Shipment } from '../models/shipment.model';
import { Charge, Currency } from '../models/charge.model';
import { Quote } from '../models/quote.model';
import { CurrencyService } from './currency.service';

@Injectable({ providedIn: 'root' })
export class FreightQuoteService {
  constructor(private readonly fx: CurrencyService) {}

  getAgents(): Observable<Agent[]> {
    return of([
      { id: 'A1', name: 'BlueOcean Logistics', contactEmail: 'sales@blueocean.com', onTimeRate: 0.91 },
      { id: 'A2', name: 'Global Freight Co', contactEmail: 'quotes@globalfreight.co', onTimeRate: 0.88 },
      { id: 'A3', name: 'SkyAir Cargo', contactEmail: 'ops@skyair.com', onTimeRate: 0.86 },
      { id: 'A4', name: 'TransWorld Lines', contactEmail: 'rfq@twlines.com', onTimeRate: 0.83 },
    ]);
  }

  simulateQuotes(shipment: Shipment): Observable<Quote[]> {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const currencies: Currency[] = ['USD', 'EUR', 'BRL'];
    return this.getAgents().pipe(
      // simple sync transform for prototype
      (src) => new Observable<Quote[]>((sub) => {
        src.subscribe((agents) => {
          const quotes: Quote[] = agents.slice(0, rand(3, 5)).map((a, idx) => {
            const cur = currencies[idx % currencies.length];
            const freightValue = { currency: cur, amount: rand(1500, 4500) };
            const transshipment = Math.random() < 0.35;
            const transshipmentCount = transshipment ? rand(1, 2) : 0;
            const transitTimeDays = shipment.mode === 'AIR' ? rand(2, 7) : rand(18, 35);
            const freeTime = { originDays: rand(3, 7), destinationDays: rand(5, 14) };
            const validity = { from: new Date(), to: new Date(Date.now() + 1000 * 60 * 60 * 24 * rand(10, 25)) };
            const charges: Charge[] = [
              { code: 'ORIGIN', description: 'Origin THC', payer: 'Origin', currency: cur, amount: rand(80, 200), unit: 'Shipment', quantity: 1 },
              { code: 'DOC', description: 'Documentation', payer: 'Customer', currency: cur, amount: rand(40, 120), unit: 'Shipment', quantity: 1 },
              { code: 'DEST', description: 'Destination THC', payer: 'Destination', currency: cur, amount: rand(100, 240), unit: 'Shipment', quantity: 1 },
            ];
            const q: Quote = {
              id: `Q-${Date.now()}-${idx}`,
              agentId: a.id,
              freightValue,
              transitTimeDays,
              transshipment,
              transshipmentCount,
              freeTime,
              validity,
              charges,
              notes: 'Valores simulados para protótipo',
              total: { currency: cur, amount: 0 },
              normalizedCostUSD: 0,
              kpi: {},
            };
            return this.computeTotals(q, shipment);
          });
          sub.next(this.rankQuotes(quotes));
          sub.complete();
        });
      })
    );
  }

  computeTotals(quote: Quote, shipment: Shipment): Quote {
    const freightInQuoteCurrency = quote.freightValue.amount;
    const chargesTotal = quote.charges.reduce((sum, c) => {
      let base = c.amount * (c.quantity || 1);
      if (c.unit === 'CBM') base = c.amount * shipment.cargo.volumeCbm;
      if (c.unit === 'KG') base = c.amount * shipment.cargo.weightKg;
      if (c.unit === 'Container') base = c.amount * (shipment.mode === 'FCL' ? 1 : 0.5);
      return sum + base;
    }, 0);
    const totalAmount = +(freightInQuoteCurrency + chargesTotal).toFixed(2);
    const totalUSD = this.fx.toUSD(totalAmount, quote.freightValue.currency);
    const costPerCbm = +(totalUSD / Math.max(1, shipment.cargo.volumeCbm)).toFixed(2);
    const costPerKg = +(totalUSD / Math.max(1, shipment.cargo.weightKg)).toFixed(2);
    return {
      ...quote,
      total: { currency: quote.freightValue.currency, amount: totalAmount },
      normalizedCostUSD: totalUSD,
      kpi: { costPerCbm, costPerKg },
    };
  }

  rankQuotes(quotes: Quote[], weights = { cost: 0.6, time: 0.3, transshipment: 0.1 }): Quote[] {
    const minCost = Math.min(...quotes.map((q) => q.normalizedCostUSD));
    const minTime = Math.min(...quotes.map((q) => q.transitTimeDays));
    return quotes
      .map((q) => {
        const costScore = minCost / q.normalizedCostUSD; // lower is better
        const timeScore = minTime / q.transitTimeDays; // lower is better
        const transshipmentPenalty = q.transshipment ? 0.8 : 1;
        const score = +(costScore * weights.cost + timeScore * weights.time) * transshipmentPenalty;
        return { ...q, kpi: { ...q.kpi, score: +score.toFixed(3) } };
      })
      .sort((a, b) => (b.kpi.score! - a.kpi.score!));
  }

  getComparisonView(quotes: Quote[]): { columns: string[]; rows: any[] } {
    const columns = ['Agente', 'Custo Total (moeda)', 'Custo Total (USD)', 'Transit Time', 'Transbordo', 'Free Time (O/D)', 'Qtde Taxas', 'Observações', 'Score'];
    const rows = quotes.map((q) => ({
      Agente: q.agentId,
      'Custo Total (moeda)': `${q.total.amount.toFixed(2)} ${q.total.currency}`,
      'Custo Total (USD)': q.normalizedCostUSD.toFixed(2),
      'Transit Time': `${q.transitTimeDays} d`,
      Transbordo: q.transshipment ? `Sim (${q.transshipmentCount ?? 1})` : 'Não',
      'Free Time (O/D)': `${q.freeTime.originDays}/${q.freeTime.destinationDays} d`,
      'Qtde Taxas': q.charges.length,
      Observações: q.notes ?? '',
      Score: q.kpi.score ?? 0,
    }));
    return { columns, rows };
  }
}



