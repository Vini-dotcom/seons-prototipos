import { Injectable } from '@angular/core';

export type Cur = 'USD' | 'EUR' | 'BRL';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  // FX mocks (1 unit of key to value currency)
  private readonly rates = {
    'USD->BRL': 5.2,
    'BRL->USD': 1 / 5.2,
    'EUR->USD': 1.08,
    'USD->EUR': 1 / 1.08,
    'EUR->BRL': 5.2 * 1.08,
    'BRL->EUR': 1 / (5.2 * 1.08),
  } as const;

  toUSD(amount: number, currency: Cur): number {
    if (currency === 'USD') return amount;
    const key = `${currency}->USD` as const;
    return +(amount * (this.rates as any)[key]).toFixed(2);
  }

  convert(amount: number, from: Cur, to: Cur): number {
    if (from === to) return amount;
    const key = `${from}->${to}` as const;
    return +(amount * (this.rates as any)[key]).toFixed(2);
  }
}



