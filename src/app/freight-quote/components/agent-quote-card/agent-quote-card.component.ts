import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Quote } from '../../models/quote.model';

@Component({
  selector: 'agent-quote-card',
  standalone: false,
  templateUrl: './agent-quote-card.component.html',
  styleUrls: ['./agent-quote-card.component.scss']
})
export class AgentQuoteCardComponent {
  @Input() quote!: Quote;
  @Output() sendToCompare = new EventEmitter<void>();
}



