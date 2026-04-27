import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCotizacionCliente } from './nueva-cotizacion-cliente';

describe('NuevaCotizacionCliente', () => {
  let component: NuevaCotizacionCliente;
  let fixture: ComponentFixture<NuevaCotizacionCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaCotizacionCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaCotizacionCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
