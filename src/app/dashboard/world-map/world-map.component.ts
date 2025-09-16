import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { DashboardDataService } from '../dashboard-data.service';

@Component({
  selector: 'world-map',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './world-map.component.html',
  styleUrls: ['./world-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorldMapComponent {
  private readonly data = inject(DashboardDataService);
  origins$ = this.data.getOriginsSummary();
  routes$ = this.data.getTopRoutes();
}



