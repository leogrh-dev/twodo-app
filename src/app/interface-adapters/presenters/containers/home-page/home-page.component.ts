import { Component } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  themeSubscription: Subscription;
  logoPath: string = 'assets/images/twodo-logos/twodo-logo.svg';
  userName: string = 'Usuário';

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
  ) {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name ?? 'Usuário';

    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.logoPath = theme.mode === 'dark'
        ? 'assets/images/twodo-logos/twodo-dark-logo.svg'
        : 'assets/images/twodo-logos/twodo-logo.svg';
    });
  }
}
