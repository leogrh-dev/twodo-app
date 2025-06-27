import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuResizerComponent } from './sidemenu-resizer.component';

describe('SidemenuResizerComponent', () => {
  let component: SidemenuResizerComponent;
  let fixture: ComponentFixture<SidemenuResizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidemenuResizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidemenuResizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
