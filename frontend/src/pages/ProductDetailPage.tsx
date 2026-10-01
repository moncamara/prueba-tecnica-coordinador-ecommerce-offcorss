import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../types';
import { fetchProductsApi } from '../services/api';
import { exportToCSV } from '../utils/csvExporter';
import { Printer, ArrowLeft, Download, CheckCircle2, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(
    (location.state as any)?.product || null
  );
  const [loading, setLoading] = useState<boolean>(!product);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

  useEffect(() => {
    if (!product && id) {
      setLoading(true);
      fetchProductsApi()
        .then(list => {
          const found = list.find(p => p.productId === id);
          if (found) setProduct(found);
        })
        .finally(() => setLoading(false));
    }
  }, [id, product]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (product) {
      exportToCSV([product], `producto_offcorss_${product.productId}.csv`);
    }
  };

  if (loading) {
    return (
      <div className="mw8 center ph3 pv5 text-center gray">
        <p className="f5 fw6 dark-gray m0">Cargando producto de la tienda OFFCORSS...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mw8 center ph3 pv5 text-center">
        <h2 className="f3 fw8 dark-gray">Producto no encontrado</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-offcorss-primary mt3">
          Volver al Catálogo
        </button>
      </div>
    );
  }

  // Filtrar y limitar las imágenes principales a un máximo de 5 miniaturas para evitar sobrecargar la interfaz
  const allImages = product.items.flatMap(item => item.images.map(img => img.imageUrl)).filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages)).slice(0, 5);
  const activeImage = uniqueImages[selectedImageIndex] || uniqueImages[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';

  // Información de precios y stock
  const selectedItem = product.items[selectedItemIndex] || product.items[0];
  const price = selectedItem?.sellers?.[0]?.commertialOffer?.Price || 49900;
  const listPrice = selectedItem?.sellers?.[0]?.commertialOffer?.ListPrice || 65990;
  const hasDiscount = listPrice > price;
  const discountPercent = hasDiscount ? Math.round(((listPrice - price) / listPrice) * 100) : 0;

  // Formatear categorías para Breadcrumb
  const rawCategories = product.categories ? product.categories.join(' / ').replace(/\//g, ' › ') : 'Catálogo';
  const cleanCategories = rawCategories.replace(/^ › /, '').replace(/ › $/, '');

  return (
    <div className="mw8 center ph3 ph4-ns pv4">
      
      {/* Miga de Pan & Botón Volver */}
      <div className="flex flex-column flex-row-ns items-start items-center-ns justify-between gap2 mb4 no-print">
        <div className="f7 gray flex items-center gap1 flex-wrap">
          <span className="pointer hover-dark-gray" onClick={() => navigate('/dashboard')}>Inicio</span>
          <ChevronRight size={12} />
          <span className="pointer hover-dark-gray" onClick={() => navigate('/dashboard')}>{cleanCategories}</span>
          <ChevronRight size={12} />
          <span className="fw6 dark-gray">{product.productTitle}</span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-offcorss-secondary f7"
        >
          <ArrowLeft size={14} /> Volver al Catálogo
        </button>
      </div>

      {/* Ficha Principal de Producto (Estilo Tienda E-commerce OFFCORSS) */}
      <div className="bg-white br4 shadow-1 pa4 pa5-ns print-card" style={{ border: '1px solid #E2E8F0' }}>
        
        {/* Rejilla de 2 Columnas Proporcionada */}
        <div className="pdp-grid items-start">
          
          {/* Columna Izquierda: Galería de Imágenes */}
          <div>
            <div className="pdp-image-box">
              {hasDiscount && (
                <span className="pdp-discount-badge no-print">
                  -{discountPercent}% OFF
                </span>
              )}
              <img
                src={activeImage}
                alt={product.productTitle}
                className="pdp-main-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>

            {/* Miniaturas de la Galería con Espaciado de 14px */}
            {uniqueImages.length > 1 && (
              <div className="thumb-gallery-container no-print">
                {uniqueImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`thumb-btn ${idx === selectedImageIndex ? 'active' : ''}`}
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Detalles Comerciales con Espaciado Holgado */}
          <div className="flex flex-column gap3">
            
            {/* Marca & Referencia (productId) */}
            <div className="flex items-center justify-between pb1">
              <span className="bg-warning dark-gray fw8 f7 ph3 pv1 br-pill uppercase tracking-wider" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                {product.brand || 'OFFCORSS'}
              </span>
              <span className="f7 gray fw6">
                Ref / ID: <strong className="dark-gray">{product.productId}</strong>
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="f2-ns f3 fw8 dark-gray tracking-tight m0 lh-title mb2">
              {product.productTitle}
            </h1>

            {/* Bloque de Precio & Oferta */}
            <div className="pv3 border-b border-t border-gray-100 flex items-baseline gap3 mb2" style={{ borderColor: '#F1F5F9' }}>
              <span className="f2 fw8 text-dark" style={{ color: '#0F172A' }}>
                ${price.toLocaleString('es-CO')} COP
              </span>
              {hasDiscount && (
                <span className="f5 gray strike">
                  ${listPrice.toLocaleString('es-CO')} COP
                </span>
              )}
              <span className="f7 bg-washed-green green ph3 pv1 br-pill fw7 flex items-center gap1 ml2" style={{ color: '#059669', backgroundColor: '#ECFDF5' }}>
                <CheckCircle2 size={13} /> Disponible en Stock
              </span>
            </div>

            {/* Selector de Tallas / Variantes con Separación Holgada (mb3) */}
            {product.items && product.items.length > 0 && (
              <div className="mb3">
                <span className="f7 gray fw7 uppercase tracking-wide db mb2">
                  Variantes / Tallas Disponibles ({product.items.length}):
                </span>
                <div className="flex flex-wrap" style={{ gap: '12px' }}>
                  {product.items.map((item, idx) => (
                    <button
                      key={item.itemId}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`size-chip ${idx === selectedItemIndex ? 'active' : ''}`}
                      title={`SKU ID: ${item.itemId}`}
                    >
                      {item.name || `SKU ${item.itemId}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción del Producto */}
            <div className="f6 gray lh-copy bg-near-white pa3 br3 mb3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <h3 className="f7 fw7 dark-gray m0 uppercase mb2 tracking-wide">Detalles y Composición</h3>
              <p className="m0 dark-gray">
                {product.description || 'Prenda confeccionada en tela de alta suavidad, ideal para el confort diario de los niños. Diseño duradero y resistente a lavados continuos.'}
              </p>
            </div>

            {/* Beneficios OFFCORSS Colocados uno debajo de otro con separación entre icono y texto */}
            <div className="flex flex-column gap2 f7 gray pv3 border-t border-gray-100 mb2" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
                <span>Garantía de calidad OFFCORSS</span>
              </div>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Truck size={18} style={{ color: '#475569', flexShrink: 0 }} />
                <span>Envíos a todo el país</span>
              </div>
            </div>

            {/* Botones de Acción (Imprimir Ficha & Exportar CSV) con Separación Holgada (gap: 16px) */}
            <div className="pt3 flex flex-wrap items-center justify-end no-print border-t border-gray-100" style={{ borderColor: '#F1F5F9', gap: '16px' }}>
              <button
                onClick={handleExportCSV}
                className="btn-offcorss-secondary"
                title="Exportar producto a CSV"
              >
                <Download size={16} /> Exportar CSV
              </button>

              <button
                onClick={handlePrint}
                className="btn-offcorss-primary"
                title="Imprimir ficha técnica"
              >
                <Printer size={16} /> Imprimir Ficha
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
