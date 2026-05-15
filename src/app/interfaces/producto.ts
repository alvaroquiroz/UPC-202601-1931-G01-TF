export interface Producto {
    id:          number;
    code:        string;
    name:        string;
    description: string;
    unit_price:  number;
    stock:       number;
    status:      'activo' | 'inactivo';
}
