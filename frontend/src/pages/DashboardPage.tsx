import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { fetchProductsApi } from '../services/api';
import { exportToCSV } from '../utils/csvExporter';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronLeft, ChevronRight, Eye, RefreshCw, Filter, Layers } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros y Paginación
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Estado del Modal de Detalle de Producto Flotante
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  // Cargar catálogo desde el proxy backend de VTEX
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductsApi();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener la lista de productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Extraer marcas disponibles para el filtro
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    return brands;
  }, [products]);

  // Filtrado de productos por término de búsqueda y marca
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch =
        p.productTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productId.includes(searchTerm);
      const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      return matchSearch && matchBrand;
    });
  }, [products, searchTerm, selectedBrand]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrand]);

  // Manejo de Selección por Checkbox
  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return new Set(next);
    });
  };

  const toggleSelectAllPage = () => {
    const allPageIds = paginatedProducts.map(p => p.productId);
    const allSelected = allPageIds.every(id => selectedRows.has(id));

    setSelectedRows(prev => {
      const next = new Set(prev);
      if (allSelected) {
        allPageIds.forEach(id => next.delete(id));
      } else {
        allPageIds.forEach(id => next.add(id));
      }
      return new Set(next);
    });
  };

  // Exportar Selección a CSV
  const handleExportCSV = () => {
    const toExport = selectedRows.size > 0
      ? products.filter(p => selectedRows.has(p.productId))
      : filteredProducts;

    exportToCSV(toExport, `catálogo_offcorss_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="mw9 center ph3 ph4-ns pv4">
      
      {/* Cabecera del Dashboard con Espaciado Holgado (gap: 16px) */}
      <div className="flex flex-column flex-row-ns items-start items-center-ns justify-between mb4 pb2 border-b border-gray-100" style={{ borderColor: '#E2E8F0', gap: '16px' }}>
        <div>
          <h1 className="f3 fw8 dark-gray tracking-tight m0 flex items-center gap2">
            <Layers size={22} style={{ color: '#FFD100' }} />
            Catálogo de Productos E-commerce
          </h1>
          <p className="f6 gray mt1 mb0">
            Sincronizado con API VTEX Catalog System OFFCORSS
          </p>
        </div>

        {/* Acciones Principales con Separación de 16px */}
        <div className="flex flex-wrap items-center w-100 w-auto-ns" style={{ gap: '16px' }}>
          <button
            onClick={loadProducts}
            className="btn-offcorss-secondary"
            title="Recargar catálogo desde VTEX"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Actualizar Datos</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-offcorss-primary"
          >
            <Download size={16} />
            <span>
              Exportar CSV ({selectedRows.size > 0 ? `${selectedRows.size} seleccionados` : 'Todos'})
            </span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros & Búsqueda con Holgura y Separación */}
      <div
        className="bg-white br3 pa3 pa4-ns shadow-1 mb4 flex flex-column flex-row-ns items-center justify-between"
        style={{ border: '1px solid #E2E8F0', gap: '20px' }}
      >
        
        {/* Buscador por Texto */}
        <div className="relative w-100 w-60-ns flex items-center">
          <Search size={18} className="absolute left-1 ml2 gray" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID de producto, título o marca..."
            className="w-100 pa3 pl5 br3 dark-gray f6 fw6"
            style={{ border: '1.5px solid #CBD5E1', height: '44px', outline: 'none' }}
          />
        </div>

        {/* Filtro por Marca con Espaciado Claro entre Etiqueta y Select */}
        <div className="flex items-center w-100 w-40-ns justify-end-ns" style={{ gap: '12px' }}>
          <Filter size={15} className="gray" />
          <span className="f7 gray fw7 uppercase tracking-wide mr1" style={{ whiteSpace: 'nowrap' }}>Marca:</span>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="pa2 ph3 br3 bg-white dark-gray f6 fw6 cursor-pointer"
            style={{ border: '1.5px solid #CBD5E1', height: '44px', outline: 'none', minWidth: '180px' }}
          >
            <option value="all">Todas las Marcas</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Tabla de Productos Aireada */}
      {loading ? (
        <div className="bg-white br3 pa5 text-center shadow-1" style={{ border: '1px solid #E2E8F0' }}>
          <RefreshCw size={32} className="spin text-warning mb2" style={{ color: '#FFD100' }} />
          <p className="f5 fw6 gray m0">Cargando productos de la tienda OFFCORSS...</p>
        </div>
      ) : error ? (
        <div className="bg-washed-red red br3 pa4 shadow-1" style={{ border: '1px solid #FCA5A5' }}>
          <p className="fw7 f5 m0">Ocurrió un problema: {error}</p>
          <button onClick={loadProducts} className="btn-offcorss-secondary mt3">Reintentar</button>
        </div>
      ) : (
        <div className="bg-white br3 shadow-1 overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
          <div className="overflow-x-auto">
            <table className="w-100 collapse f6 text-left">
              <thead>
                <tr className="bg-near-white bb dark-gray fw7" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
                  <th className="pa3 w2 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every(p => selectedRows.has(p.productId))
                      }
                      onChange={toggleSelectAllPage}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="pa3">Imagen</th>
                  <th className="pa3">productId</th>
                  <th className="pa3">Título del Producto</th>
                  <th className="pa3">Brand (Marca)</th>
                  <th className="pa3">Ítems (Listado de itemId)</th>
                  <th className="pa3 text-center" style={{ whiteSpace: 'nowrap' }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="pa4 text-center gray f5">
                      No se encontraron productos que coincidan con el filtro.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map(product => {
                    const isSelected = selectedRows.has(product.productId);
                    const mainImage = product.items[0]?.images[0]?.imageUrl || 'https://via.placeholder.com/80';
                    const itemIds = product.items.map(item => item.itemId);

                    return (
                      <tr
                        key={product.productId}
                        className={`hover-bg-washed-yellow transition-all ${isSelected ? 'bg-washed-yellow' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="pa3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(product.productId)}
                            className="cursor-pointer"
                          />
                        </td>

                        {/* Previsualización de Imagen */}
                        <td className="pa3">
                          <div className="br2 ba overflow-hidden flex items-center justify-center bg-near-white" style={{ width: '64px', height: '64px', borderColor: '#E2E8F0' }}>
                            <img
                              src={mainImage}
                              alt={product.productTitle}
                              className="w-100 h-100 object-cover cursor-pointer"
                              onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                              }}
                            />
                          </div>
                        </td>

                        {/* ID Producto */}
                        <td className="pa3 fw7 dark-gray">
                          <span className="bg-near-white ph2 pv1 br2" style={{ backgroundColor: '#F1F5F9' }}>{product.productId}</span>
                        </td>

                        {/* Título de Producto */}
                        <td
                          className="pa3 fw6 dark-gray max-w-xs cursor-pointer hover-text-warning"
                          onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                        >
                          {product.productTitle}
                        </td>

                        {/* Marca */}
                        <td className="pa3">
                          <span className="fw8 text-dark bg-warning ph3 pv1 br-pill f7" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                            {product.brand || 'OFFCORSS'}
                          </span>
                        </td>

                        {/* SKUs / Ítems */}
                        <td className="pa3">
                          <div className="flex flex-wrap gap1 max-w-xs">
                            {itemIds.map(id => (
                              <span key={id} className="f7 bg-light-gray gray ph2 pv1 br2 fw6" style={{ backgroundColor: '#F1F5F9' }}>
                                {id}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Botón Ver Detalle en Una Sola Línea Garantizada */}
                        <td className="pa3 text-center" style={{ whiteSpace: 'nowrap' }}>
                          <button
                            onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                            className="btn-offcorss-secondary ph3 pv2 f7"
                            style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            title="Ver ficha de detalle del producto"
                          >
                            <Eye size={14} />
                            <span style={{ whiteSpace: 'nowrap' }}>Ver Detalle</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Paginador */}
          <div className="pv3 ph4 bg-near-white bt flex flex-column flex-row-ns items-center justify-between gap2" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <span className="f7 gray fw6">
              Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} registros
            </span>

            <div className="flex items-center gap2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn-offcorss-secondary ph3 pv2 f7 disabled-opacity cursor-pointer"
              >
                <ChevronLeft size={14} /> Anterior
              </button>
              <span className="f7 fw7 dark-gray ph2">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-offcorss-secondary ph3 pv2 f7 disabled-opacity cursor-pointer"
              >
                Siguiente <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Modal Flotante de Detalle de Producto */}
      <ProductDetailModal
        product={selectedProductForModal}
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

    </div>
  );
};
