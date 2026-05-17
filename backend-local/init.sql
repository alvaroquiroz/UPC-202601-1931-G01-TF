-- ========================================================================
-- 1. CREACIÓN DE LA BASE DE DATOS Y CONFIGURACIÓN DE SEGURIDAD (INFRAESTRUCTURA)
-- ========================================================================
CREATE DATABASE db_cotizaciones;
GO

USE master;
GO

-- Creamos el login de SQL Server para tus Lambdas si no existe
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'admin')
BEGIN
    CREATE LOGIN [admin] WITH PASSWORD = 'SuperPassword123!', DEFAULT_DATABASE = db_cotizaciones, CHECK_EXPIRATION = OFF, CHECK_POLICY = OFF;
END
GO

USE db_cotizaciones;
GO

-- Mapeamos el login como usuario dentro de la BD y le asignamos rol de Administrador (db_owner)
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'admin')
BEGIN
    CREATE USER [admin] FOR LOGIN [admin];
    ALTER ROLE db_owner ADD MEMBER [admin];
END
GO

-- ========================================================================
-- 2. DISEÑO DE TABLAS (SCHEMA)
-- ========================================================================
CREATE TABLE roles (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(20)  NOT NULL,
    description NVARCHAR(100) NULL
);

CREATE TABLE users (
    id         INT PRIMARY KEY IDENTITY(1,1),
    role_id    INT           NOT NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name  NVARCHAR(100) NOT NULL,
    email      NVARCHAR(150) NOT NULL UNIQUE,
    password   NVARCHAR(255) NOT NULL,
    phone      NVARCHAR(20)  NULL,
    empresa    NVARCHAR(100) NULL,
    status     NVARCHAR(20)  NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_at DATETIME      DEFAULT GETDATE(),
    updated_at DATETIME      DEFAULT GETDATE(),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE password_resets (
    id         INT PRIMARY KEY IDENTITY(1,1),
    user_id    INT           NOT NULL,
    token      NVARCHAR(255) NOT NULL,
    expires_at DATETIME      NOT NULL,
    used_at    DATETIME      NULL,
    created_at DATETIME      DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE products (
    id          INT PRIMARY KEY IDENTITY(1,1),
    code        NVARCHAR(20)  NOT NULL UNIQUE,
    name        NVARCHAR(150) NOT NULL,
    description NVARCHAR(MAX) NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    stock       INT           NOT NULL DEFAULT 0,
    status      NVARCHAR(20)  NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
    created_at  DATETIME      DEFAULT GETDATE(),
    updated_at  DATETIME      DEFAULT GETDATE()
);

CREATE TABLE quotation_statuses (
    id          INT PRIMARY KEY IDENTITY(1,1),
    name        NVARCHAR(20)  NOT NULL,
    description NVARCHAR(100) NULL
);

CREATE TABLE quotations (
    id               INT PRIMARY KEY IDENTITY(1,1),
    code             NVARCHAR(50)  NOT NULL UNIQUE,
    client_user_id   INT           NOT NULL,
    vendor_user_id   INT           NULL,
    status_id        INT           NOT NULL,
    quotation_date   DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    subtotal         DECIMAL(10,2) NOT NULL DEFAULT 0,
    igv              DECIMAL(10,2) NOT NULL DEFAULT 0,
    total            DECIMAL(10,2) NOT NULL DEFAULT 0,
    general_comment  NVARCHAR(MAX) NULL,
    sent_at          DATETIME      NULL,
    reviewed_at      DATETIME      NULL,
    created_at       DATETIME      DEFAULT GETDATE(),
    updated_at       DATETIME      DEFAULT GETDATE(),
    FOREIGN KEY (client_user_id) REFERENCES users(id),
    FOREIGN KEY (vendor_user_id) REFERENCES users(id),
    FOREIGN KEY (status_id)      REFERENCES quotation_statuses(id)
);

CREATE TABLE quotation_items (
    id            INT PRIMARY KEY IDENTITY(1,1),
    quotation_id  INT           NOT NULL,
    product_id    INT           NOT NULL,
    quantity      INT           NOT NULL DEFAULT 1,
    unit_price    DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_igv      DECIMAL(10,2) NOT NULL DEFAULT 0,
    line_total    DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (quotation_id) REFERENCES quotations(id),
    FOREIGN KEY (product_id)   REFERENCES products(id)
);

CREATE TABLE quotation_observations (
    id            INT PRIMARY KEY IDENTITY(1,1),
    quotation_id  INT           NOT NULL,
    user_id       INT           NOT NULL,
    comment       NVARCHAR(MAX) NOT NULL,
    created_at    DATETIME      DEFAULT GETDATE(),
    FOREIGN KEY (quotation_id) REFERENCES quotations(id),
    FOREIGN KEY (user_id)       REFERENCES users(id)
);

CREATE TABLE quotation_status_history (
    id                   INT PRIMARY KEY IDENTITY(1,1),
    quotation_id         INT           NOT NULL,
    previous_status_id   INT           NOT NULL,
    new_status_id        INT           NOT NULL,
    changed_by_user_id   INT           NOT NULL,
    comment              NVARCHAR(MAX) NULL,
    changed_at           DATETIME      DEFAULT GETDATE(),
    FOREIGN KEY (quotation_id)       REFERENCES quotations(id),
    FOREIGN KEY (previous_status_id) REFERENCES quotation_statuses(id),
    FOREIGN KEY (new_status_id)      REFERENCES quotation_statuses(id),
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);
GO

-- ========================================================================
-- 3. SEMILLERO DE DATOS (INSERTS DE PRUEBA)
-- ========================================================================
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador'), ('vendedor', 'Vendedor'), ('cliente', 'Cliente');

INSERT INTO quotation_statuses (name, description) VALUES
('Borrador', 'En borrador'), ('Pendiente', 'Enviada'), ('Aprobada', 'Aprobada'), ('Observada', 'Con cambios'), ('Rechazada', 'Rechazada');

INSERT INTO users (role_id, first_name, last_name, email, password, phone, empresa, status) VALUES
(1, 'Admin',  'Sistema', 'admin@cotizaciones.com',  '$2b$10$hashadmin',     NULL,           NULL,          'activo'),
(2, 'Carlos', 'Vega',    'carlos@cotizaciones.com', '$2b$10$hashvendedor1', '+51999111222',  NULL,          'activo'),
(2, 'Ana',    'Rios',    'ana@cotizaciones.com',    '$2b$10$hashvendedor2', '+51999333444',  NULL,          'activo'),
(3, 'Juan',   'Perez',   'juan@tech.com',           '$2b$10$hashcliente1', '+51999555666',  'Tech SAC',    'activo'),
(3, 'Maria',  'Lopez',   'maria@sol.com',           '$2b$10$hashcliente2', '+51999777888',  'Sol SRL',     'activo'),
(3, 'Carlos', 'Ruiz',    'carlos@gn.com',           '$2b$10$hashcliente3', '+51999999000',  'Grupo Norte', 'activo');

INSERT INTO products (code, name, description, unit_price, stock, status) VALUES
('PROD-001', 'Laptop Dell XPS 15',  'Laptop profesional 15 pulgadas', 4500.00, 10, 'activo'),
('PROD-002', 'Monitor LG 27"',      'Monitor 4K IPS',                 1200.00, 15, 'activo'),
('PROD-003', 'Teclado Mecanico',    'Teclado mecanico RGB',            350.00,  20, 'activo'),
('PROD-004', 'Mouse Inalambrico',   'Mouse ergonomico inalambrico',    180.00,  25, 'activo'),
('PROD-005', 'Auriculares Sony',    'Auriculares noise cancelling',    650.00,  12, 'activo'),
('PROD-006', 'Webcam Logitech',     'Webcam 4K videoconferencias',     420.00,  18, 'activo');

INSERT INTO quotations (code, client_user_id, vendor_user_id, status_id, quotation_date, subtotal, igv, total, general_comment) VALUES
('COT-001', 4, 2, 2, CAST(GETDATE() AS DATE), 1200.00,  216.00,  1416.00, 'Entrega urgente para el lunes'),
('COT-002', 5, 2, 3, CAST(GETDATE() AS DATE), 3750.00,  675.00,  4425.00, NULL),
('COT-003', 6, 2, 4, CAST(GETDATE() AS DATE),  890.00,  160.20,  1050.20, 'Verificar stock del monitor'),
('COT-004', 4, 2, 3, CAST(GETDATE() AS DATE), 6200.00, 1116.00,  7316.00, NULL),
('COT-005', 5, 2, 5, CAST(GETDATE() AS DATE),  450.00,   81.00,   531.00, 'Cliente no disponible');

INSERT INTO quotation_items (quotation_id, product_id, quantity, unit_price, line_subtotal, line_igv, line_total) VALUES
(1, 4, 2, 180.00,  360.00,   64.80,  424.80),
(1, 3, 1, 350.00,  350.00,   63.00,  413.00),
(1, 5, 1, 650.00,  650.00,  117.00,  767.00),
(2, 1, 1, 4500.00, 4500.00, 810.00, 5310.00),
(3, 2, 1, 1200.00, 1200.00, 216.00, 1416.00),
(4, 1, 1, 4500.00, 4500.00, 810.00, 5310.00),
(4, 2, 1, 1200.00, 1200.00, 216.00, 1416.00),
(5, 4, 1,  180.00,  180.00,  32.40,  212.40);

INSERT INTO quotation_status_history (quotation_id, previous_status_id, new_status_id, changed_by_user_id, comment) VALUES
(2, 2, 3, 2, 'Todo correcto, aprobado'),
(3, 2, 4, 3, 'Verificar disponibilidad del monitor'),
(4, 2, 3, 3, 'Aprobado sin observaciones'),
(5, 2, 5, 2, 'Cliente no responde');

INSERT INTO quotation_observations (quotation_id, user_id, comment) VALUES
(3, 3, 'Verificar disponibilidad del monitor antes de aprobar'),
(5, 2, 'Cliente no responde a las llamadas');
GO