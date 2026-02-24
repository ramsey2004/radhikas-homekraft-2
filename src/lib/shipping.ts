/**
 * Shipping Integration Service
 * Supports Shiprocket and Delhivery for order fulfillment
 */

export type ShippingProvider = 'shiprocket' | 'delhivery' | 'manual';

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShipmentDetails {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  subtotal: number;
  total: number;
  items: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
    discount?: number;
  }>;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  dimensions?: {
    length: number;
    breadth: number;
    height: number;
    weight: number;
  };
}

export interface ShipmentResponse {
  success: boolean;
  shipmentId?: string;
  awbCode?: string;
  trackingUrl?: string;
  error?: string;
  data?: any;
}

/**
 * Shiprocket API Integration
 */
class ShiprocketService {
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;
  private tokenExpiry: number = 0;

  async authenticate(): Promise<boolean> {
    try {
      // Check if token is still valid (with 5 min buffer)
      if (this.token && Date.now() < this.tokenExpiry - 300000) {
        return true;
      }

      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        }),
      });

      if (!response.ok) {
        throw new Error('Shiprocket authentication failed');
      }

      const data = await response.json();
      this.token = data.token;
      // Token valid for 10 days, store expiry
      this.tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;
      return true;
    } catch (error) {
      console.error('Shiprocket auth error:', error);
      return false;
    }
  }

  async createOrder(shipment: ShipmentDetails): Promise<ShipmentResponse> {
    try {
      await this.authenticate();

      if (!this.token) {
        return { success: false, error: 'Authentication failed' };
      }

      const orderData = {
        order_id: shipment.orderNumber,
        order_date: shipment.orderDate,
        pickup_location: 'Primary',
        channel_id: '',
        comment: 'Radhika\'s Homecraft Order',
        billing_customer_name: shipment.billingAddress?.name || shipment.shippingAddress.name,
        billing_last_name: '',
        billing_address: shipment.billingAddress?.address || shipment.shippingAddress.address,
        billing_city: shipment.billingAddress?.city || shipment.shippingAddress.city,
        billing_pincode: shipment.billingAddress?.pincode || shipment.shippingAddress.pincode,
        billing_state: shipment.billingAddress?.state || shipment.shippingAddress.state,
        billing_country: shipment.billingAddress?.country || shipment.shippingAddress.country,
        billing_email: shipment.shippingAddress.email,
        billing_phone: shipment.shippingAddress.phone,
        shipping_is_billing: !shipment.billingAddress,
        shipping_customer_name: shipment.shippingAddress.name,
        shipping_last_name: '',
        shipping_address: shipment.shippingAddress.address,
        shipping_city: shipment.shippingAddress.city,
        shipping_pincode: shipment.shippingAddress.pincode,
        shipping_country: shipment.shippingAddress.country,
        shipping_state: shipment.shippingAddress.state,
        shipping_email: shipment.shippingAddress.email,
        shipping_phone: shipment.shippingAddress.phone,
        order_items: shipment.items,
        payment_method: shipment.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
        shipping_charges: 0,
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: 0,
        sub_total: shipment.subtotal,
        length: shipment.dimensions?.length || 10,
        breadth: shipment.dimensions?.breadth || 10,
        height: shipment.dimensions?.height || 10,
        weight: shipment.dimensions?.weight || 0.5,
      };

      const response = await fetch(`${this.baseUrl}/orders/create/adhoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to create shipment',
          data,
        };
      }

      return {
        success: true,
        shipmentId: data.shipment_id?.toString(),
        data,
      };
    } catch (error) {
      console.error('Shiprocket create order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async generateAWB(shipmentId: string, courierId: number): Promise<ShipmentResponse> {
    try {
      await this.authenticate();

      if (!this.token) {
        return { success: false, error: 'Authentication failed' };
      }

      const response = await fetch(`${this.baseUrl}/courier/assign/awb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
          courier_id: courierId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to generate AWB',
          data,
        };
      }

      return {
        success: true,
        awbCode: data.response?.data?.awb_code,
        data,
      };
    } catch (error) {
      console.error('Shiprocket generate AWB error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async trackShipment(awbCode: string): Promise<ShipmentResponse> {
    try {
      await this.authenticate();

      if (!this.token) {
        return { success: false, error: 'Authentication failed' };
      }

      const response = await fetch(`${this.baseUrl}/courier/track/awb/${awbCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to track shipment',
          data,
        };
      }

      return {
        success: true,
        trackingUrl: `https://shiprocket.co/tracking/${awbCode}`,
        data,
      };
    } catch (error) {
      console.error('Shiprocket track error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async cancelShipment(awbCodes: string[]): Promise<ShipmentResponse> {
    try {
      await this.authenticate();

      if (!this.token) {
        return { success: false, error: 'Authentication failed' };
      }

      const response = await fetch(`${this.baseUrl}/orders/cancel/shipment/awbs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
        },
        body: JSON.stringify({ awbs: awbCodes }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      console.error('Shiprocket cancel error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAvailableCouriers(
    pickupPostcode: string,
    deliveryPostcode: string,
    weight: number,
    cod: boolean
  ): Promise<any> {
    try {
      await this.authenticate();

      if (!this.token) {
        return { success: false, error: 'Authentication failed' };
      }

      const params = new URLSearchParams({
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
        weight: weight.toString(),
        cod: cod ? '1' : '0',
      });

      const response = await fetch(`${this.baseUrl}/courier/serviceability?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Shiprocket get couriers error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

/**
 * Delhivery API Integration
 */
class DelhiveryService {
  private baseUrl = 'https://track.delhivery.com/api';
  private token = process.env.DELHIVERY_API_KEY;

  async createOrder(shipment: ShipmentDetails): Promise<ShipmentResponse> {
    try {
      if (!this.token) {
        return { success: false, error: 'Delhivery API key not configured' };
      }

      const orderData = {
        shipments: [
          {
            name: shipment.shippingAddress.name,
            add: shipment.shippingAddress.address,
            pin: shipment.shippingAddress.pincode,
            city: shipment.shippingAddress.city,
            state: shipment.shippingAddress.state,
            country: shipment.shippingAddress.country,
            phone: shipment.shippingAddress.phone,
            order: shipment.orderNumber,
            payment_mode: shipment.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            return_pin: '',
            return_city: '',
            return_phone: '',
            return_add: '',
            return_state: '',
            return_country: '',
            products_desc: shipment.items.map(i => i.name).join(', '),
            hsn_code: '',
            cod_amount: shipment.paymentMethod === 'COD' ? shipment.total : 0,
            order_date: shipment.orderDate,
            total_amount: shipment.total,
            seller_add: '',
            seller_name: '',
            seller_inv: '',
            quantity: shipment.items.reduce((sum, item) => sum + item.units, 0),
            waybill: '',
            shipment_width: shipment.dimensions?.breadth || 10,
            shipment_height: shipment.dimensions?.height || 10,
            weight: shipment.dimensions?.weight || 0.5,
            seller_gst_tin: '',
            shipping_mode: 'Surface',
            address_type: 'home',
          },
        ],
        pickup_location: {
          name: 'Radhika\'s Homecraft',
        },
      };

      const response = await fetch(`${this.baseUrl}/cmu/create.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create shipment',
          data,
        };
      }

      return {
        success: true,
        awbCode: data.packages?.[0]?.waybill,
        data,
      };
    } catch (error) {
      console.error('Delhivery create order error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async trackShipment(waybill: string): Promise<ShipmentResponse> {
    try {
      if (!this.token) {
        return { success: false, error: 'Delhivery API key not configured' };
      }

      const response = await fetch(`${this.baseUrl}/v1/packages/json/?waybill=${waybill}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to track shipment',
          data,
        };
      }

      return {
        success: true,
        trackingUrl: `https://www.delhivery.com/track/package/${waybill}`,
        data,
      };
    } catch (error) {
      console.error('Delhivery track error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async cancelShipment(waybill: string): Promise<ShipmentResponse> {
    try {
      if (!this.token) {
        return { success: false, error: 'Delhivery API key not configured' };
      }

      const response = await fetch(`${this.baseUrl}/p/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.token}`,
        },
        body: JSON.stringify({
          waybill,
          cancellation: true,
        }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        data,
      };
    } catch (error) {
      console.error('Delhivery cancel error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Singleton instances
export const shiprocketService = new ShiprocketService();
export const delhiveryService = new DelhiveryService();

/**
 * Unified shipping service
 */
export async function createShipment(
  provider: ShippingProvider,
  shipment: ShipmentDetails
): Promise<ShipmentResponse> {
  switch (provider) {
    case 'shiprocket':
      return shiprocketService.createOrder(shipment);
    case 'delhivery':
      return delhiveryService.createOrder(shipment);
    case 'manual':
      return {
        success: true,
        shipmentId: `MANUAL-${Date.now()}`,
      };
    default:
      return {
        success: false,
        error: 'Invalid shipping provider',
      };
  }
}

export async function trackShipment(
  provider: ShippingProvider,
  trackingCode: string
): Promise<ShipmentResponse> {
  switch (provider) {
    case 'shiprocket':
      return shiprocketService.trackShipment(trackingCode);
    case 'delhivery':
      return delhiveryService.trackShipment(trackingCode);
    default:
      return {
        success: false,
        error: 'Tracking not available for this provider',
      };
  }
}

export async function cancelShipment(
  provider: ShippingProvider,
  trackingCode: string
): Promise<ShipmentResponse> {
  switch (provider) {
    case 'shiprocket':
      return shiprocketService.cancelShipment([trackingCode]);
    case 'delhivery':
      return delhiveryService.cancelShipment(trackingCode);
    default:
      return {
        success: false,
        error: 'Cancellation not available for this provider',
      };
  }
}
