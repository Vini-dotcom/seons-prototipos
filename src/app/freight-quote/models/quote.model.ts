import { Charge, Currency } from './charge.model';

export interface Quote {
  id: string;
  agentId: string;
  freightValue: { currency: Currency; amount: number };
  transitTimeDays: number;
  transshipment: boolean;
  transshipmentCount?: number;
  freeTime: { originDays: number; destinationDays: number };
  validity: { from: Date; to: Date };
  charges: Charge[];
  notes?: string;
  total: { currency: string; amount: number };
  normalizedCostUSD: number;
  kpi: { costPerCbm?: number; costPerKg?: number; score?: number };
}



