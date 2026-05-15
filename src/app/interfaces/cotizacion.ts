export interface Cotizacion {
    id:              number;
    code:            string;
    quotation_date:  string;
    subtotal:        number;
    igv:             number;
    total:           number;
    estado:          'Borrador' | 'Pendiente' | 'Aprobada' | 'Observada' | 'Rechazada';
    general_comment: string;
    cliente:         string;
    correo_cliente:  string;
    empresa:         string;
    telefono:        string; 
}

export interface CotizacionDetalle {
    cotizacion: Cotizacion;
    productos:  ProductoCotizacion[];
}

export interface ProductoCotizacion {
    producto:      string;
    code:          string;
    quantity:      number;
    unit_price:    number;
    line_subtotal: number;
    line_igv:      number;
    line_total:    number;
}
