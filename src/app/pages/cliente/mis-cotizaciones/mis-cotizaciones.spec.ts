import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCotizaciones } from './mis-cotizaciones';

describe('MisCotizaciones', () => {
  let component: MisCotizaciones;
  let fixture: ComponentFixture<MisCotizaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCotizaciones],
    }).compileComponents();

    fixture = TestBed.createComponent(MisCotizaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
