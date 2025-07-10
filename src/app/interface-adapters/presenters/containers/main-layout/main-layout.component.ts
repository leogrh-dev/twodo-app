import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { SidemenuResizerComponent } from '../../components/sidemenu-resizer/sidemenu-resizer.component';
import { MainToolbarComponent } from '../../components/main-toolbar/main-toolbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    SidemenuComponent,
    SidemenuResizerComponent,
    MainToolbarComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  isCollapsed = false;
  sidemenuWidth = 280;

  ngOnInit(): void {
    this.restoreSidemenuCollapseState();
    this.restoreSidemenuWidth();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidemenuCollapsed', String(this.isCollapsed));
  }

  onResizeSidemenu(newWidth: number): void {
    this.sidemenuWidth = newWidth;
    localStorage.setItem('sidemenuWidth', String(newWidth));
  }

  onClickResizer(): void {
    this.toggleCollapse();
  }

  private restoreSidemenuCollapseState(): void {
    const saved = localStorage.getItem('sidemenuCollapsed');
    if (saved !== null) {
      this.isCollapsed = saved === 'true';
    }
  }

  private restoreSidemenuWidth(): void {
    const saved = localStorage.getItem('sidemenuWidth');
    if (saved !== null) {
      const width = parseInt(saved, 10);
      this.sidemenuWidth = this.clamp(width, 240, 480);
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}