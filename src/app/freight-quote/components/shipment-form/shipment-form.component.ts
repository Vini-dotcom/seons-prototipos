import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'shipment-form',
  standalone: false,
  templateUrl: './shipment-form.component.html',
  styleUrls: ['./shipment-form.component.scss'],
})
export class ShipmentFormComponent {
  @Output() changed = new EventEmitter<Shipment>();
  private readonly fb = inject(FormBuilder);
  form = this.fb.group({
    mode: ['FCL', Validators.required],
    containerType: ['20DC'],
    incoterm: ['FOB', Validators.required],
    originCountry: ['China', Validators.required],
    originPort: ['Shanghai', Validators.required],
    destCountry: ['Brasil', Validators.required],
    destPort: ['Santos', Validators.required],
    weightKg: [1000, [Validators.required, Validators.min(1)]],
    volumeCbm: [10, [Validators.required, Validators.min(0.1)]],
    units: [1, [Validators.required, Validators.min(1)]],
    commodity: ['Eletrônicos'],
    hsCode: [''],
    readyDate: [new Date(), Validators.required],
  });

  emit() {
    const v = this.form.value;
    const shipment: Shipment = {
      mode: v.mode as any,
      containerType: v.containerType as any,
      incoterm: v.incoterm as any,
      origin: { country: v.originCountry!, port: v.originPort! },
      destination: { country: v.destCountry!, port: v.destPort! },
      cargo: { weightKg: v.weightKg!, volumeCbm: v.volumeCbm!, units: v.units!, commodity: v.commodity!, hsCode: v.hsCode! },
      readyDate: v.readyDate!,
      specialReqs: [],
    };
    this.changed.emit(shipment);
  }
}


