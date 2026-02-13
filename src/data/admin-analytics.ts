export interface DailySales {
  date: string;
  orders: number;
  revenue: number;
  customers: number;
}

export interface CategorySales {
  category: string;
  revenue: number;
  orderCount: number;
  percentage: number;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomers: number;
  avgOrderValue: number;
  totalOrdersPlaced: number;
  churn: number;
}

export interface AdminAnalytics {
  period: 'today' | 'week' | 'month' | 'year';
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  conversionRate: number;
  customerSatisfaction: number;
  returnRate: number;
}

// Sales data for the last 30 days
export const DAILY_SALES: DailySales[] = [
  { date: '2026-01-11', orders: 8, revenue: 28500, customers: 7 },
  { date: '2026-01-12', orders: 12, revenue: 42300, customers: 11 },
  { date: '2026-01-13', orders: 6, revenue: 18900, customers: 6 },
  { date: '2026-01-14', orders: 15, revenue: 59200, customers: 14 },
  { date: '2026-01-15', orders: 10, revenue: 35600, customers: 9 },
  { date: '2026-01-16', orders: 18, revenue: 71400, customers: 17 },
  { date: '2026-01-17', orders: 9, revenue: 31200, customers: 8 },
  { date: '2026-01-18', orders: 14, revenue: 49800, customers: 13 },
  { date: '2026-01-19', orders: 11, revenue: 38900, customers: 10 },
  { date: '2026-01-20', orders: 16, revenue: 64500, customers: 15 },
  { date: '2026-01-21', orders: 7, revenue: 23100, customers: 7 },
  { date: '2026-01-22', orders: 13, revenue: 46200, customers: 12 },
  { date: '2026-01-23', orders: 9, revenue: 32400, customers: 9 },
  { date: '2026-01-24', orders: 17, revenue: 68900, customers: 16 },
  { date: '2026-01-25', orders: 10, revenue: 36700, customers: 10 },
  { date: '2026-01-26', orders: 19, revenue: 76800, customers: 18 },
  { date: '2026-01-27', orders: 8, revenue: 27500, customers: 8 },
  { date: '2026-01-28', orders: 14, revenue: 50200, customers: 13 },
  { date: '2026-01-29', orders: 11, revenue: 39600, customers: 11 },
  { date: '2026-01-30', orders: 15, revenue: 60100, customers: 14 },
  { date: '2026-01-31', orders: 12, revenue: 44300, customers: 11 },
  { date: '2026-02-01', orders: 9, revenue: 33400, customers: 9 },
  { date: '2026-02-02', orders: 16, revenue: 65200, customers: 15 },
  { date: '2026-02-03', orders: 10, revenue: 37800, customers: 10 },
  { date: '2026-02-04', orders: 18, revenue: 72400, customers: 17 },
  { date: '2026-02-05', orders: 14, revenue: 51600, customers: 13 },
  { date: '2026-02-06', orders: 11, revenue: 40200, customers: 11 },
  { date: '2026-02-07', orders: 17, revenue: 69800, customers: 16 },
  { date: '2026-02-08', orders: 13, revenue: 47900, customers: 12 },
  { date: '2026-02-09', orders: 20, revenue: 80500, customers: 19 },
];

export const CATEGORY_SALES: CategorySales[] = [
  {
    category: 'Bedsheets',
    revenue: 128400,
    orderCount: 42,
    percentage: 35.2,
  },
  {
    category: 'Cushions',
    revenue: 95600,
    orderCount: 38,
    percentage: 26.1,
  },
  {
    category: 'Rugs',
    revenue: 71900,
    orderCount: 8,
    percentage: 19.7,
  },
  {
    category: 'Wall Art',
    revenue: 47200,
    orderCount: 12,
    percentage: 12.9,
  },
  {
    category: 'Throws & Blankets',
    revenue: 22800,
    orderCount: 14,
    percentage: 6.2,
  },
];

export const CUSTOMER_ANALYTICS: CustomerAnalytics = {
  totalCustomers: 234,
  newCustomersThisMonth: 28,
  repeatCustomers: 156,
  avgOrderValue: 4286,
  totalOrdersPlaced: 387,
  churn: 8,
};

export const MONTHLY_ANALYTICS: AdminAnalytics = {
  period: 'month',
  totalRevenue: 1459400,
  totalOrders: 387,
  avgOrderValue: 3769,
  conversionRate: 2.8,
  customerSatisfaction: 4.8,
  returnRate: 2.1,
};

export const DASHBOARD_STATS = {
  thisMonth: {
    revenue: MONTHLY_ANALYTICS.totalRevenue,
    orders: MONTHLY_ANALYTICS.totalOrders,
    customers: CUSTOMER_ANALYTICS.newCustomersThisMonth,
    change: { revenue: '+12.5%', orders: '+8.3%', customers: '+15.2%' },
  },
  today: {
    revenue: DAILY_SALES[DAILY_SALES.length - 1].revenue,
    orders: DAILY_SALES[DAILY_SALES.length - 1].orders,
    avgOrderValue: Math.round(DAILY_SALES[DAILY_SALES.length - 1].revenue / DAILY_SALES[DAILY_SALES.length - 1].orders),
  },
};
