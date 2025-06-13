import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme-services/theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {

  constructor(private themeService: ThemeService) {}

  toggle() {
    this.themeService.toggleTheme();
  }
}
