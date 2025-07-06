import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBannerComponent } from './note-banner.component';

describe('NoteBannerComponent', () => {
  let component: NoteBannerComponent;
  let fixture: ComponentFixture<NoteBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
