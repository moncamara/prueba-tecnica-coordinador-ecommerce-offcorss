import React, { useState } from 'react';
import { Product } from '../types';
import { X, Printer, CheckCircle2, Download, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { exportToCSV } from '../utils/csvExporter';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    exportToCSV([product], `producto_offcorss_${product.productId}.csv`);
  };

  // Galería de imágenes limpias (máximo 5)
  const allImages = product.items.flatMap(item => item.images.map(img => img.imageUrl)).filter(Boolean);
  const uniqueImages = Array.from(new Set(allImages)).slice(0, 5);
  const activeImage = uniqueImages[selectedImageIndex] || uniqueImages[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';

  // Datos comerciales
  const selectedItem = product.items[selectedItemIndex] || product.items[0];
  const price = selectedItem?.sellers?.[0]?.commertialOffer?.Price || 49900;
  const listPrice = selectedItem?.sellers?.[0]?.commertialOffer?.ListPrice || 65990;
  const hasDiscount = listPrice > price;
  const discountPercent = hasDiscount ? Math.round(((listPrice - price) / listPrice) * 100) : 0;

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center ph3 py3 overflow-y-auto no-print-overlay"
      style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Contenedor Modal E-commerce OFFCORSS */}
      <div
        className="bg-white br4 w-100 max-w-4xl shadow-5 overflow-hidden transition-all relative print-card my-auto"
        style={{ border: '1px solid #E2E8F0' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="pv3 ph4 text-white flex items-center justify-between no-print" style={{ backgroundColor: '#0F172A' }}>
          <div className="flex items-center gap2">
            <Sparkles size={16} style={{ color: '#FFD100' }} />
            <span className="fw7 f6 text-white tracking-wide">Ficha de Producto OFFCORSS</span>
          </div>
          
          <div className="flex items-center" style={{ gap: '12px' }}>
            <button onClick={handleExportCSV} className="btn-offcorss-secondary pv1 ph3 f7">
              <Download size={14} /> CSV
            </button>
            <button onClick={handlePrint} className="btn-offcorss-primary pv1 ph3 f7">
              <Printer size={14} /> Imprimir
            </button>
            <button onClick={onClose} className="bg-transparent border-none text-white hover-near-white pointer p1 transition-all ml2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Rejilla PDP E-commerce */}
        <div className="pa4 pa5-ns pdp-grid items-start">
          
          {/* Imagen & Miniaturas */}
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

            {uniqueImages.length > 1 && (
              <div className="thumb-gallery-container no-print">
                {uniqueImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`thumb-btn ${idx === selectedImageIndex ? 'active' : ''}`}
                    style={{ width: '56px', height: '56px' }}
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles Comerciales con Espaciado Holgado */}
          <div className="flex flex-column gap3">
            
            <div className="flex items-center justify-between pb1">
              <span className="bg-warning dark-gray fw8 f7 ph3 pv1 br-pill uppercase tracking-wider" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                {product.brand || 'OFFCORSS'}
              </span>
              <span className="f7 gray fw6">
                Ref: <strong className="dark-gray">{product.productId}</strong>
              </span>
            </div>

            <h2 className="f3-ns f4 fw8 dark-gray tracking-tight m0 lh-title mb2">
              {product.productTitle}
            </h2>

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

            {/* Selector de Tallas con Separación Holgada */}
            {product.items && product.items.length > 0 && (
              <div className="mb3">
                <span className="f7 gray fw7 uppercase tracking-wide db mb2">Variantes / Tallas:</span>
                <div className="flex flex-wrap" style={{ gap: '10px' }}>
                  {product.items.map((item, idx) => (
                    <button
                      key={item.itemId}
                      onClick={() => setSelectedItemIndex(idx)}
                      className={`size-chip ${idx === selectedItemIndex ? 'active' : ''}`}
                    >
                      {item.name || `SKU ${item.itemId}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="f6 gray lh-copy bg-near-white pa3 br3 mb3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="m0 dark-gray">
                {product.description || 'Prenda confeccionada en tela de alta suavidad, ideal para el confort diario de los niños.'}
              </p>
            </div>

            <div className="flex flex-column gap2 f7 gray pv2 border-t border-gray-100 mb1" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <ShieldCheck size={17} style={{ color: '#059669', flexShrink: 0 }} />
                <span>Garantía de calidad OFFCORSS</span>
              </div>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <Truck size={17} style={{ color: '#475569', flexShrink: 0 }} />
                <span>Envíos a todo el país</span>
              </div>
            </div>

            <div className="pt3 flex flex-wrap items-center justify-end no-print border-t border-gray-100" style={{ borderColor: '#F1F5F9', gap: '16px' }}>
              <button onClick={onClose} className="btn-offcorss-secondary">
                Cerrar
              </button>
              <button onClick={handlePrint} className="btn-offcorss-primary">
                <Printer size={16} /> Imprimir Ficha
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
