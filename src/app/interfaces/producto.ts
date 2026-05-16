export interface Producto {
    id:          number;
    code:        string;
    stock:       number;
    status:      'activo' | 'inactivo';

    // Campos en Español
    nombre:      string;
    descripcion: string;
    precio:      number;

    // Campos en Inglés
    name:        string;
    description: string;
    unit_price:  number;
}
