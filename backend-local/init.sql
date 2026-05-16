CREATE DATABASE db_cotizaciones;
GO
USE db_cotizaciones;
GO

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
    code             NVARCHAR(20)  NOT NULL UNIQUE,
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
    FOREIGN KEY (user_id)      REFERENCES users(id)
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

-- INSERTS
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador'), ('vendedor', 'Vendedor'), ('cliente', 'Cliente');

INSERT INTO quotation_statuses (name, description) VALUES
('Borrador', 'En borrador'), ('Pendiente', 'Enviada'), ('Aprobada', 'Aprobada'), ('Observada', 'Con cambios'), ('Rechazada', 'Rechazada');

INSERT INTO users (role_id, first_name, last_name, email, password, phone, status) VALUES
(1, 'Admin', 'Sistema', 'admin@cotizaciones.com', 'hash', NULL, 'activo'),
(2, 'Carlos', 'Vega', 'carlos@cotizaciones.com', 'hash', '+51999111222', 'activo'),
(3, 'Juan', 'Perez', 'cliente@empresa.com', 'hash', '+51999555666', 'activo');

INSERT INTO products (code, name, description, unit_price, stock, status) VALUES
('PROD-001', 'Laptop Dell XPS 15', 'Laptop 15 pulgadas', 4500.00, 10, 'activo'),
('PROD-002', 'Monitor LG 27"', 'Monitor 4K', 1200.00, 15, 'activo'),
('PROD-003', 'Teclado Mecanico', 'Teclado RGB', 350.00, 20, 'activo');
GO