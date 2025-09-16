export type ShipmentMode = 'FCL' | 'LCL' | 'AIR';
export type ContainerType = '20DC' | '40DC' | '40HC' | 'LCL' | 'AIR';
export type Incoterm = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';

export interface Shipment {
  id?: string;
  mode: ShipmentMode;
  containerType?: ContainerType;
  incoterm: Incoterm;
  origin: { country: string; port: string };
  destination: { country: string; port: string };
  cargo: { weightKg: number; volumeCbm: number; units: number; commodity?: string; hsCode?: string };
  readyDate?: Date;
  specialReqs?: string[];
}



