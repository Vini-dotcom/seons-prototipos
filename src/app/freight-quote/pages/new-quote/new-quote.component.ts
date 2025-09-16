import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ShipmentFormComponent } from '../../components/shipment-form/shipment-form.component';
import { ChargesEditorComponent } from '../../components/charges-editor/charges-editor.component';
import { AgentQuoteCardComponent } from '../../components/agent-quote-card/agent-quote-card.component';
import { DecisionPanelComponent } from '../../components/decision-panel/decision-panel.component';
import { FreightQuoteService } from '../../services/freight-quote.service';
import { Shipment } from '../../models/shipment.model';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'app-new-quote',
  standalone: false,
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.scss'],
})
export class NewQuoteComponent {
  private readonly fb = inject(FormBuilder);
  constructor(private readonly svc: FreightQuoteService) {}

  stepperForm = this.fb.group({
    shipment: [null as Shipment | null, Validators.required],
    charges: [[] as any[]],
    applyChargesToAll: [true as boolean],
    selectedQuotes: [[] as Quote[]],
  });

  quotes: Quote[] = [];

  onShipmentChange(s: Shipment) { this.stepperForm.patchValue({ shipment: s }); }
  onChargesChange(charges: any[]) { this.stepperForm.patchValue({ charges: charges as any }); }

  simulate() {
    const shipment = this.stepperForm.value.shipment!;
    this.svc.simulateQuotes(shipment).subscribe((qs) => {
      this.quotes = qs.map((q) => {
        if (this.stepperForm.value.applyChargesToAll) {
          q.charges = [...q.charges, ...this.stepperForm.value.charges!];
          return this.svc.computeTotals(q, shipment);
        }
        return q;
      });
    });
  }

  toggleSelect(q: Quote) {
    const sel = new Set(this.stepperForm.value.selectedQuotes);
    sel.has(q) ? sel.delete(q) : sel.add(q);
    this.stepperForm.patchValue({ selectedQuotes: Array.from(sel) });
  }
}


