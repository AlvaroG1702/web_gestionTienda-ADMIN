// ── Producto tal como lo devuelve la API (JOIN de 4 tablas) ───────────────────
export type Producto = {
  IdNegocioProducto:  number;
  IdProducto:         number;
  Nombre:             string;
  Descripcion:        string | null;
  Codigo_barras:      string | null;
  Imagen_url:         string | null;
  IdCategoria:        number | null;
  NombreCategoria:    string | null;
  IdProveedor:        number | null;
  NombreProveedor:    string | null;
  PrecioCompra:       number | null;
  PrecioVenta:        number | null;
  PrecioPaquete:      number | null;
  CantidadPorPaquete: number | null;
  MargenGanancia:     number | null;
  FechaActualizacion: string | null;
  Estado:             boolean;
};

// Payload para crear/actualizar un producto
export type ProductoInput = {
  IdNegocio:     number;
  IdCategoria?:  number;
  IdProveedor?:  number;
  IdUsuario?:    number;
  Nombre:        string;
  Descripcion?:  string;
  Codigo_barras?: string;
  Imagen_url?:   string;
  PrecioCompra:       number;
  PrecioVenta:        number;
  PrecioPaquete?:     number;
  CantidadPorPaquete?: number;
  Estado?:            boolean;
};

// ── Catálogo ──────────────────────────────────────────────────────────────────
export type Categoria = {
  IdCategoria: number;
  Nombre:      string;
  Descripcion: string | null;
};

export type Proveedor = {
  IdProveedor: number;
  IdNegocio:   number;
  Nombre:      string;
  Telefono:    string | null;
  Correo:      string | null;
};

export type Negocio = {
  IdNegocio:     number;
  Nombre:        string;
  Slug:          string;
  Direccion:     string | null;
  Tipo:          string | null;
  Logo_url:      string | null;
  Estado:        boolean;
  FechaCreacion: string | null;
};

// ── Tipos legacy (compatibilidad con componentes existentes) ──────────────────
/** @deprecated Usar Producto en su lugar */
export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  featured?: boolean;
  createdAt: Date;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type PrintItem = {
  producto: Producto;
  quantity: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};
