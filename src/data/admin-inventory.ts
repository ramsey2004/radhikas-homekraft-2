export interface InventoryItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  lastRestocked: string;
  supplier?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
}

export interface InventoryStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalInventoryValue: number;
  totalCostValue: number;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  {
    productId: '1',
    productName: 'Terracotta Artisan Bedsheet',
    sku: 'SHEET-TERRA-001',
    category: 'Bedsheets',
    stock: 45,
    reorderLevel: 20,
    unitPrice: 3499,
    costPrice: 1750,
    lastRestocked: '2026-02-05',
    supplier: 'Jaipur Artisans Co.',
    status: 'in-stock',
  },
  {
    productId: '2',
    productName: 'Sage Green Cushions',
    sku: 'CUSH-SAGE-002',
    category: 'Cushions',
    stock: 8,
    reorderLevel: 15,
    unitPrice: 1299,
    costPrice: 650,
    lastRestocked: '2026-01-28',
    supplier: 'Artisan Weavers Ltd.',
    status: 'low-stock',
  },
  {
    productId: '3',
    productName: 'Natural Wool Rug',
    sku: 'RUG-WOOL-003',
    category: 'Rugs',
    stock: 12,
    reorderLevel: 10,
    unitPrice: 5999,
    costPrice: 3000,
    lastRestocked: '2026-02-01',
    supplier: 'Premium Textiles Inc.',
    status: 'in-stock',
  },
  {
    productId: '4',
    productName: 'Indigo Bedsheet',
    sku: 'SHEET-INDIGO-004',
    category: 'Bedsheets',
    stock: 3,
    reorderLevel: 20,
    unitPrice: 2999,
    costPrice: 1500,
    lastRestocked: '2026-01-15',
    supplier: 'Jaipur Artisans Co.',
    status: 'low-stock',
  },
  {
    productId: '5',
    productName: 'Block Print Throw',
    sku: 'THROW-BLK-005',
    category: 'Throws',
    stock: 0,
    reorderLevel: 15,
    unitPrice: 1599,
    costPrice: 800,
    lastRestocked: '2025-12-20',
    supplier: 'Block Print Masters',
    status: 'out-of-stock',
  },
  {
    productId: '6',
    productName: 'Wall Hanging Art',
    sku: 'ART-HANG-006',
    category: 'Wall Art',
    stock: 22,
    reorderLevel: 10,
    unitPrice: 3999,
    costPrice: 2000,
    lastRestocked: '2026-02-03',
    supplier: 'Artisan Collective',
    status: 'in-stock',
  },
  {
    productId: '7',
    productName: 'Organic Cotton Pillow Covers',
    sku: 'PILLOW-ORG-007',
    category: 'Pillow Covers',
    stock: 67,
    reorderLevel: 25,
    unitPrice: 899,
    costPrice: 450,
    lastRestocked: '2026-02-08',
    supplier: 'Organic Textile Co.',
    status: 'in-stock',
  },
  {
    productId: '8',
    productName: 'Handwoven Placemats',
    sku: 'PLACEMAT-HAND-008',
    category: 'Table Linens',
    stock: 5,
    reorderLevel: 20,
    unitPrice: 499,
    costPrice: 250,
    lastRestocked: '2025-12-10',
    supplier: 'Weaver\'s Guild',
    status: 'low-stock',
  },
  {
    productId: '9',
    productName: 'Natural Dye Table Runner',
    sku: 'RUNNER-NAT-009',
    category: 'Table Linens',
    stock: 31,
    reorderLevel: 15,
    unitPrice: 1899,
    costPrice: 950,
    lastRestocked: '2026-01-30',
    supplier: 'Natural Dye Artisans',
    status: 'in-stock',
  },
  {
    productId: '10',
    productName: 'Knitted Throw Blanket',
    sku: 'BLANKET-KNIT-010',
    category: 'Blankets',
    stock: 19,
    reorderLevel: 15,
    unitPrice: 2499,
    costPrice: 1250,
    lastRestocked: '2026-02-02',
    supplier: 'Textile Mills Co.',
    status: 'in-stock',
  },
];

export const INVENTORY_STATS: InventoryStats = {
  totalProducts: INVENTORY_ITEMS.length,
  inStock: INVENTORY_ITEMS.filter((i) => i.status === 'in-stock').length,
  lowStock: INVENTORY_ITEMS.filter((i) => i.status === 'low-stock').length,
  outOfStock: INVENTORY_ITEMS.filter((i) => i.status === 'out-of-stock').length,
  totalInventoryValue: INVENTORY_ITEMS.reduce((sum, i) => sum + i.stock * i.unitPrice, 0),
  totalCostValue: INVENTORY_ITEMS.reduce((sum, i) => sum + i.stock * i.costPrice, 0),
};
