import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    SidemenuComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})

export class MainLayoutComponent {
  isCollapsed = false;

  constructor(
  ) {
    
  }

  ngOnInit() {
    const savedState = localStorage.getItem('sidemenuCollapsed');
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidemenuCollapsed', this.isCollapsed.toString());
  }
}
