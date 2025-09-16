import { Component, Input } from '@angular/core';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'decision-panel',
  standalone: false,
  templateUrl: './decision-panel.component.html',
  styleUrls: ['./decision-panel.component.scss']
})
export class DecisionPanelComponent {
  @Input() quotes: Quote[] = [];
}



