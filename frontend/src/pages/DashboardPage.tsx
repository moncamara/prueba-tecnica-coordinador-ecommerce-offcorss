import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { fetchProductsApi } from '../services/api';
import { exportToCSV } from '../utils/csvExporter';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronLeft, ChevronRight, Eye, RefreshCw, Filter, Layers, CheckSquare, Square } from 'lucide-react';

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
    <div className="mw9 center ph2 ph4-ns pv3 pv4-ns">

      {/* Cabecera del Dashboard Responsiva */}
      <div className="flex flex-column flex-row-ns items-start items-center-ns justify-between mb3 mb4-ns pb2 border-b border-gray-100" style={{ borderColor: '#E2E8F0', gap: '12px' }}>
        <div>
          <h1 className="f4 f3-ns fw8 dark-gray tracking-tight m0 flex items-center gap2">
            <Layers className='mr2' size={20} style={{ color: '#FFD100' }} />
            Catálogo de Productos E-commerce
          </h1>
          <p className="f7 f6-ns gray mt1 mb0">
            Sincronizado con API VTEX Catalog System OFFCORSS
          </p>
        </div>

        {/* Acciones Principales Adaptadas a Móvil */}
        <div className="flex flex-wrap items-center w-100 w-auto-ns gap2 gap3-ns mt2 mt0-ns">
          <button
            onClick={loadProducts}
            className="btn-offcorss-secondary flex-1 flex-none-ns mr2"
            title="Recargar catálogo desde VTEX"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Actualizar</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-offcorss-primary flex-1 flex-none-ns"
          >
            <Download size={15} />
            <span>
              Exportar CSV ({selectedRows.size > 0 ? `${selectedRows.size}` : 'Todos'})
            </span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros & Búsqueda Responsiva */}
      <div
        className="bg-white br3 pa3 pa4-ns shadow-1 mb3 mb4-ns flex flex-column flex-row-ns items-center justify-between gap3"
        style={{ border: '1px solid #E2E8F0' }}
      >
        {/* Buscador por Texto */}
        <div className="relative w-100 w-60-ns flex items-center">
          <Search size={18} className="absolute ml3 gray" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar producto, marca o ID..."
            className="w-100 pa2 pa3-ns br3 dark-gray f6 fw6"
            style={{ border: '1.5px solid #CBD5E1', height: '44px', outline: 'none', paddingLeft: '40px' }}
          />
        </div>

        {/* Filtro por Marca */}
        <div className="flex items-center w-100 w-40-ns justify-start justify-end-ns gap2">
          <Filter size={15} className="gray shrink-0" />
          <span className="f7 gray fw7 uppercase tracking-wide shrink-0">Marca:</span>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="pa2 ph3 br3 bg-white dark-gray f6 fw6 cursor-pointer w-100 w-auto-ns"
            style={{ border: '1.5px solid #CBD5E1', height: '44px', outline: 'none' }}
          >
            <option value="all">Todas las Marcas</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenido Principal: Estado de Carga / Error / Lista de Productos */}
      {loading ? (
        <div className="bg-white br3 pa4 pa5-ns text-center shadow-1" style={{ border: '1px solid #E2E8F0' }}>
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

          {/* 📱 VISTA MÓVIL: Tarjetas Adaptativas (visible en pantalla pequeña) */}
          <div className="dn-ns pa2">
            {/* Barra superior de Selección Todo en Móvil */}
            <div className="flex items-center justify-between pa3 bg-near-white br3 mb3" style={{ border: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={toggleSelectAllPage}
                className="flex items-center gap2 bg-transparent bn outline-0 dark-gray fw7 f7 pointer pa0"
              >
                {paginatedProducts.length > 0 && paginatedProducts.every(p => selectedRows.has(p.productId)) ? (
                  <CheckSquare size={18} className="text-warning" style={{ color: '#FFD100' }} />
                ) : (
                  <Square size={18} className="gray" />
                )}
                <span>Seleccionar página</span>
              </button>
              <span className="f7 gray fw6">{paginatedProducts.length} ítems</span>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="pa4 text-center gray f6">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="flex flex-column gap3">
                {paginatedProducts.map(product => {
                  const isSelected = selectedRows.has(product.productId);
                  const mainImage = product.items[0]?.images[0]?.imageUrl || 'https://via.placeholder.com/80';
                  const itemIds = product.items.map(item => item.itemId);

                  return (
                    <div
                      key={product.productId}
                      className={`mobile-product-card ${isSelected ? 'selected' : ''}`}
                    >
                      {/* Fila 1: Checkbox + Thumbnail + Título + ID */}
                      <div className="flex items-start gap2 mb2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(product.productId)}
                          className="mt1 cursor-pointer shrink-0"
                          style={{ width: '18px', height: '18px' }}
                        />

                        <div
                          className="br2 ba overflow-hidden flex items-center justify-center bg-near-white shrink-0 cursor-pointer"
                          style={{ width: '56px', height: '56px', borderColor: '#E2E8F0' }}
                          onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                        >
                          <img
                            src={mainImage}
                            alt={product.productTitle}
                            className="w-100 h-100 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                        </div>

                        <div className="flex-auto min-w-0">
                          <div className="flex items-center justify-between gap1 mb1">
                            <span className="bg-near-white ph2 pv1 br2 f7 fw7 dark-gray" style={{ backgroundColor: '#F1F5F9' }}>
                              ID: {product.productId}
                            </span>
                            <span className="fw8 text-dark bg-warning ph2 pv1 br-pill f7" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                              {product.brand || 'OFFCORSS'}
                            </span>
                          </div>

                          <h3
                            className="f6 fw7 dark-gray m0 lh-title cursor-pointer hover-text-warning truncate-2"
                            onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                          >
                            {product.productTitle}
                          </h3>
                        </div>
                      </div>

                      {/* Fila 2: SKUs */}
                      <div className="flex flex-wrap gap1 mb3">
                        <span className="f7 gray fw6 mr1">SKUs:</span>
                        {itemIds.map(id => (
                          <span key={id} className="f7 bg-light-gray gray ph2 pv1 br2 fw6" style={{ backgroundColor: '#F1F5F9' }}>
                            {id}
                          </span>
                        ))}
                      </div>

                      {/* Fila 3: Botón Ver Detalle a Ancho Completo */}
                      <button
                        onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                        className="btn-offcorss-secondary w-100 f7 pv2 flex items-center justify-center gap2"
                      >
                        <Eye size={14} />
                        <span>Ver Detalle del Producto</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 💻 VISTA ESCRITORIO: Tabla Completa de Datos (visible en pantallas medianas/grandes) */}
          <div className="dn db-ns overflow-x-auto">
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
                        <td className="pa3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(product.productId)}
                            className="cursor-pointer"
                          />
                        </td>

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

                        <td className="pa3 fw7 dark-gray">
                          <span className="bg-near-white ph2 pv1 br2" style={{ backgroundColor: '#F1F5F9' }}>{product.productId}</span>
                        </td>

                        <td
                          className="pa3 fw6 dark-gray max-w-xs cursor-pointer hover-text-warning"
                          onClick={() => navigate(`/product/${product.productId}`, { state: { product } })}
                        >
                          {product.productTitle}
                        </td>

                        <td className="pa3">
                          <span className="fw8 text-dark bg-warning ph3 pv1 br-pill f7" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                            {product.brand || 'OFFCORSS'}
                          </span>
                        </td>

                        <td className="pa3">
                          <div className="flex flex-wrap gap1 max-w-xs">
                            {itemIds.map(id => (
                              <span key={id} className="f7 bg-light-gray gray ph2 pv1 br2 fw6" style={{ backgroundColor: '#F1F5F9' }}>
                                {id}
                              </span>
                            ))}
                          </div>
                        </td>

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

          {/* Paginador Responsivo */}
          <div className="pv3 ph3 ph4-ns bg-near-white bt flex flex-column flex-row-ns items-center justify-between gap2" style={{ backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }}>
            <span className="f7 gray fw6 text-center text-left-ns">
              Mostrando {filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} registros
            </span>

            <div className="flex items-center justify-center gap2 w-100 w-auto-ns">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="btn-offcorss-secondary ph2 ph3-ns pv2 f7 disabled-opacity cursor-pointer flex-1 flex-none-ns"
              >
                <ChevronLeft size={14} /> Anterior
              </button>
              <span className="f7 fw7 dark-gray ph2 shrink-0">
                Pág. {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-offcorss-secondary ph2 ph3-ns pv2 f7 disabled-opacity cursor-pointer flex-1 flex-none-ns"
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
