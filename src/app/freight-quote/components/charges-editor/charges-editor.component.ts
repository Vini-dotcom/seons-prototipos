import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Charge, ChargeUnit, Currency, Payer } from '../../models/charge.model';

@Component({
  selector: 'charges-editor',
  standalone: false,
  templateUrl: './charges-editor.component.html',
  styleUrls: ['./charges-editor.component.scss'],
})
export class ChargesEditorComponent {
  @Input() applyAll = true;
  @Output() applyAllChange = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<Charge[]>();

  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    charges: this.fb.array([]),
  });

  ngOnInit(): void {
    if (this.charges.length === 0) {
      this.addCharge({ code: 'DOC', description: 'Documentation', payer: 'Customer', currency: 'USD', amount: 50, unit: 'Shipment', quantity: 1 });
    }
  }

  get charges(): FormArray { return this.form.get('charges') as FormArray; }

  createChargeGroup = (c: Partial<Charge> = {}) => this.fb.group({
    code: this.fb.control<string>(c.code ?? '', { validators: [Validators.required] }),
    description: this.fb.control<string>(c.description ?? '', { validators: [Validators.required] }),
    payer: this.fb.control<Payer>(c.payer as Payer ?? 'Customer', { validators: [Validators.required] }),
    currency: this.fb.control<Currency>(c.currency as Currency ?? 'USD', { validators: [Validators.required] }),
    amount: this.fb.control<number>(c.amount as number ?? 0, { validators: [Validators.required, Validators.min(0)] }),
    unit: this.fb.control<ChargeUnit>(c.unit as ChargeUnit ?? 'Shipment', { validators: [Validators.required] }),
    quantity: this.fb.control<number>(c.quantity as number ?? 1, { validators: [Validators.required, Validators.min(1)] }),
  });

  addCharge(c?: Partial<Charge>) {
    this.charges.push(this.createChargeGroup(c));
    this.emit();
  }

  removeCharge(idx: number) {
    this.charges.removeAt(idx);
    this.emit();
  }

  emit() {
    const values = this.charges.controls.map((g) => g.getRawValue()) as Charge[];
    this.changed.emit(values);
  }
}


