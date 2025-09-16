import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
 
  `,
  styles: [
    `
      .playground {
        padding: 16px;
        display: grid;
        gap: 16px;
      }
    `,
  ],
})
export class PlaygroundComponent {}


