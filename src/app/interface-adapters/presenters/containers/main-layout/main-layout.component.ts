import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidemenuComponent } from '../../components/sidemenu/sidemenu.component';
import { SidemenuResizerComponent } from '../../components/sidemenu-resizer/sidemenu-resizer.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from '../../components/main-toolbar/main-toolbar.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    NzMenuModule,
    SidemenuComponent,
    SidemenuResizerComponent,
    MainToolbarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})

export class MainLayoutComponent {
  isCollapsed = false;
  sidemenuWidth = 280;
  isTemporarilyExpanded = false;

  constructor(
  ) {

  }

  ngOnInit() {
    this.restoreSidemenuCollapseState();
    this.restoreSidemenuWidth();
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidemenuCollapsed', this.isCollapsed.toString());
  }

  onResizeSidemenu(newWidth: number) {
    this.sidemenuWidth = newWidth;
    localStorage.setItem('sidemenuWidth', newWidth.toString());
  }

  onClickResizer() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidemenuCollapsed', this.isCollapsed.toString());
  }

  private restoreSidemenuCollapseState() {
    const savedState = localStorage.getItem('sidemenuCollapsed');
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true';
    }
  }

  private restoreSidemenuWidth() {
    const savedWidth = localStorage.getItem('sidemenuWidth');
    if (savedWidth !== null) {
      const width = parseInt(savedWidth, 10);
      this.sidemenuWidth = Math.min(Math.max(width, 240), 480);
    }
  }
}
