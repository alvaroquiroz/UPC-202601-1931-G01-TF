export interface Usuario {
    id:         number;
    first_name: string;
    last_name:  string;
    email:      string;
    phone:      string;
    status:     'activo' | 'inactivo';
    role:       'admin' | 'vendedor' | 'cliente';
    empresa?:     string;
    cotizaciones?: number;
}
