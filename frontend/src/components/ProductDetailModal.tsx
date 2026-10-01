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
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center ph2 ph3-ns py3 py4-ns overflow-y-auto no-print-overlay"
      style={{ zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Contenedor Modal E-commerce OFFCORSS */}
      <div
        className="bg-white br3 br4-ns w-100 max-w-4xl shadow-5 overflow-hidden transition-all relative print-card my-auto"
        style={{ border: '1px solid #E2E8F0', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="pv2 pv3-ns ph3 ph4-ns text-white flex items-center justify-between no-print" style={{ backgroundColor: '#0F172A' }}>
          <div className="flex items-center gap1 gap2-ns">
            <Sparkles size={16} style={{ color: '#FFD100' }} />
            <span className="fw7 f7 f6-ns text-white tracking-wide">Ficha de Producto</span>
          </div>
          
          <div className="flex items-center gap2">
            <button onClick={handleExportCSV} className="btn-offcorss-secondary pv1 ph2 ph3-ns f7">
              <Download size={13} /> <span className="dn sm-inline">CSV</span>
            </button>
            <button onClick={handlePrint} className="btn-offcorss-primary pv1 ph2 ph3-ns f7">
              <Printer size={13} /> <span className="dn sm-inline">Imprimir</span>
            </button>
            <button onClick={onClose} className="bg-transparent border-none text-white hover-near-white pointer p1 transition-all ml1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Rejilla PDP E-commerce */}
        <div className="pa3 pa4-m pa5-l pdp-grid items-start">
          
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
                  >
                    <img src={imgUrl} alt={`Vista ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles Comerciales */}
          <div className="flex flex-column gap2 gap3-ns">
            
            <div className="flex items-center justify-between pb1">
              <span className="bg-warning dark-gray fw8 f7 ph3 pv1 br-pill uppercase tracking-wider" style={{ backgroundColor: '#FFD100', color: '#0F172A' }}>
                {product.brand || 'OFFCORSS'}
              </span>
              <span className="f7 gray fw6">
                Ref: <strong className="dark-gray">{product.productId}</strong>
              </span>
            </div>

            <h2 className="f4 f3-ns fw8 dark-gray tracking-tight m0 lh-title">
              {product.productTitle}
            </h2>

            <div className="pv2 pv3-ns border-b border-t border-gray-100 flex flex-wrap items-baseline gap2 gap3-ns" style={{ borderColor: '#F1F5F9' }}>
              <span className="f3 f2-ns fw8 text-dark" style={{ color: '#0F172A' }}>
                ${price.toLocaleString('es-CO')} COP
              </span>
              {hasDiscount && (
                <span className="f6 f5-ns gray strike">
                  ${listPrice.toLocaleString('es-CO')} COP
                </span>
              )}
              <span className="f7 bg-washed-green green ph2 ph3-ns pv1 br-pill fw7 flex items-center gap1" style={{ color: '#059669', backgroundColor: '#ECFDF5' }}>
                <CheckCircle2 size={13} /> Disponible
              </span>
            </div>

            {/* Selector de Tallas */}
            {product.items && product.items.length > 0 && (
              <div>
                <span className="f7 gray fw7 uppercase tracking-wide db mb2">Variantes / Tallas:</span>
                <div className="flex flex-wrap gap2">
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

            <div className="f7 f6-ns gray lh-copy bg-near-white pa3 br3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <p className="m0 dark-gray">
                {product.description || 'Prenda confeccionada en tela de alta suavidad, ideal para el confort diario de los niños.'}
              </p>
            </div>

            <div className="flex flex-column gap2 f7 gray pv2 border-t border-gray-100" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap2">
                <ShieldCheck size={16} style={{ color: '#059669', flexShrink: 0 }} />
                <span>Garantía de calidad OFFCORSS</span>
              </div>
              <div className="flex items-center gap2">
                <Truck size={16} style={{ color: '#475569', flexShrink: 0 }} />
                <span>Envíos a todo el país</span>
              </div>
            </div>

            <div className="pt2 pt3-ns flex items-center justify-end gap2 no-print border-t border-gray-100" style={{ borderColor: '#F1F5F9' }}>
              <button onClick={onClose} className="btn-offcorss-secondary flex-1 flex-none-ns">
                Cerrar
              </button>
              <button onClick={handlePrint} className="btn-offcorss-primary flex-1 flex-none-ns">
                <Printer size={15} /> Imprimir Ficha
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
