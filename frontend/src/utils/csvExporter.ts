import { Product } from '../types';

/**
 * Utilidad para exportar el listado de productos seleccionados o filtrados a formato .csv
 * Cumple con el requerimiento de exportación del reporte de catálogo de OFFCORSS.
 */
export function exportToCSV(products: Product[], filename: string = 'reporte_productos_offcorss.csv') {
  if (!products || products.length === 0) {
    alert('No hay productos seleccionados para exportar.');
    return;
  }

  // Encabezados del archivo CSV
  const headers = ['ID Producto', 'Título del Producto', 'Marca', 'IDs de Ítems (SKUs)', 'Cant. Ítems', 'Categorías'];

  // Construcción de las filas
  const rows = products.map(product => {
    const itemIds = product.items.map(item => item.itemId).join('; ');
    const categoriesStr = product.categories ? product.categories.join(' / ') : '';

    return [
      `"${product.productId}"`,
      `"${product.productTitle.replace(/"/g, '""')}"`,
      `"${product.brand}"`,
      `"${itemIds}"`,
      product.items.length,
      `"${categoriesStr}"`
    ].join(',');
  });

  // Contenido completo CSV con codificación UTF-8
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

  // Creación del enlace de descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
