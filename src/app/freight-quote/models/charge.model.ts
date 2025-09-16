export type Payer = 'Origin' | 'Destination' | 'Carrier' | 'Customer';
export type Currency = 'USD' | 'EUR' | 'BRL';
export type ChargeUnit = 'Shipment' | 'Container' | 'W/M' | 'CBM' | 'KG';

export interface Charge {
  code: string;
  description: string;
  payer: Payer;
  currency: Currency;
  amount: number;
  unit: ChargeUnit;
  quantity: number;
}



