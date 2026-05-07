import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Product, CartItem, PrintItem, Producto, ProductoInput } from '../types';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/productosService';

// ── ID del negocio activo (hasta que haya login real) ─────────────────────────
export const ID_NEGOCIO = 1;

interface StoreContextType {
  // ── Productos reales desde la BD ──────────────────────────────────────────
  productos:       Producto[];
  loadingProductos: boolean;
  errorProductos:   string | null;
  reloadProductos: () => void;
  addProducto:    (data: ProductoInput) => Promise<void>;
  editProducto:   (id: number, data: Partial<ProductoInput>) => Promise<void>;
  removeProducto: (id: number) => Promise<void>;

  // ── Carrito (usa Product legacy para compatibilidad con cart/modal) ────────
  cart:               CartItem[];
  addToCart:          (product: Product) => void;
  removeFromCart:     (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart:          () => void;
  cartTotal:          number;
  cartCount:          number;

  // ── Cola de Impresión ──────────────────────────────────────────────────────
  printQueue:           PrintItem[];
  addToPrintQueue:      (producto: Producto) => void;
  removeFromPrintQueue: (productoId: number) => void;
  updatePrintQuantity:  (productoId: number, quantity: number) => void;
  clearPrintQueue:      () => void;
  printQueueCount:      number;

  // ── Legacy: alias de productos como Product[] para hooks existentes ────────
  products:      Product[];
  addProduct:    (product: Omit<Product, 'id' | 'createdAt'>) => void;
  editProduct:   (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Mapea Producto (BD) → Product (legacy) para no romper los hooks actuales
const toProduct = (p: Producto): Product => ({
  id:          String(p.IdNegocioProducto),
  name:        p.Nombre,
  description: p.Descripcion ?? '',
  category:    p.NombreCategoria ?? 'Sin categoría',
  price:       p.PrecioVenta    ?? 0,
  originalPrice: p.PrecioCompra ?? undefined,
  image:       p.Imagen_url     ?? '',
  stock:       0,                          // campo no existe en BD aún
  featured:    false,
  createdAt:   p.FechaActualizacion ? new Date(p.FechaActualizacion) : new Date(),
});

export const StoreProvider = ({ children }: { children: ReactNode }) => {

  // ── Estado de productos reales ─────────────────────────────────────────────
  const [productos,        setProductos]        = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorProductos,   setErrorProductos]   = useState<string | null>(null);

  // ── Estado del carrito ─────────────────────────────────────────────────────
  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Estado de la cola de impresión ─────────────────────────────────────────
  const [printQueue, setPrintQueue] = useState<PrintItem[]>([]);

  // ── Carga inicial y recarga ────────────────────────────────────────────────
  const reloadProductos = useCallback(async () => {
    setLoadingProductos(true);
    setErrorProductos(null);
    try {
      const data = await getProductos(ID_NEGOCIO);
      setProductos(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar productos';
      setErrorProductos(msg);
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  useEffect(() => { reloadProductos(); }, [reloadProductos]);

  // ── CRUD asíncrono ─────────────────────────────────────────────────────────
  const addProducto = async (data: ProductoInput) => {
    await createProducto({ ...data, IdNegocio: ID_NEGOCIO });
    await reloadProductos();
  };

  const editProducto = async (id: number, data: Partial<ProductoInput>) => {
    await updateProducto(id, data);
    await reloadProductos();
  };

  const removeProducto = async (id: number) => {
    await deleteProducto(id);
    await reloadProductos();
  };

  // ── Alias legacy para hooks/componentes que usan Product ──────────────────
  const products = productos.map(toProduct);

  const addProduct = (_data: Omit<Product, 'id' | 'createdAt'>) => {
    // no-op legacy: usar addProducto en su lugar
    console.warn('addProduct legacy: usa addProducto con ProductoInput');
  };
  const editProduct = (_id: string, _u: Partial<Product>) => {
    console.warn('editProduct legacy: usa editProducto con ProductoInput');
  };
  const deleteProduct = (id: string) => {
    removeProducto(Number(id));
  };

  // ── Carrito ────────────────────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) =>
    setCart(prev => prev.filter(item => item.product.id !== productId));

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Cola de Impresión ──────────────────────────────────────────────────────
  const addToPrintQueue = (producto: Producto) => {
    setPrintQueue(prev => {
      const existing = prev.find(item => item.producto.IdNegocioProducto === producto.IdNegocioProducto);
      if (existing) {
        return prev.map(item =>
          item.producto.IdNegocioProducto === producto.IdNegocioProducto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { producto, quantity: 1 }];
    });
  };

  const removeFromPrintQueue = (productoId: number) =>
    setPrintQueue(prev => prev.filter(item => item.producto.IdNegocioProducto !== productoId));

  const updatePrintQuantity = (productoId: number, quantity: number) => {
    if (quantity <= 0) { removeFromPrintQueue(productoId); return; }
    setPrintQueue(prev =>
      prev.map(item =>
        item.producto.IdNegocioProducto === productoId ? { ...item, quantity } : item
      )
    );
  };

  const clearPrintQueue = () => setPrintQueue([]);

  const printQueueCount = printQueue.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      // ── API real
      productos, loadingProductos, errorProductos, reloadProductos,
      addProducto, editProducto, removeProducto,
      // ── legacy
      products, addProduct, editProduct, deleteProduct,
      // ── carrito
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount,
      // ── impresión
      printQueue, addToPrintQueue, removeFromPrintQueue, updatePrintQuantity, clearPrintQueue, printQueueCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
