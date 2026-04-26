import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarCotizacion } from './solicitar-cotizacion';

describe('SolicitarCotizacion', () => {
  let component: SolicitarCotizacion;
  let fixture: ComponentFixture<SolicitarCotizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitarCotizacion],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitarCotizacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
