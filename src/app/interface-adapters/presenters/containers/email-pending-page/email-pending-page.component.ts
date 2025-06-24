import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-email-pending-page',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './email-pending-page.component.html',
  styleUrls: ['./email-pending-page.component.scss'],
})
export class EmailPendingPageComponent {
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  themeSubscription: Subscription;

  constructor(
    private router: Router,
    private themeService: ThemeService,
  ) {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
