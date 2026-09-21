export type StockStatus = "in_stock" | "out_of_stock";
export type EventType = "view" | "inquiry";

export interface Shop {
  id: string;
  slug: string;
  name: string;
  whatsapp_number: string;
  location: string | null;
  description: string | null;
  owner_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  shop_id: string;
  title: string;
  price: number | null;
  fabric: string | null;
  occasion_tag: string | null;
  stock_status: StockStatus;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  type: EventType;
  product_id: string;
  shop_id: string;
  created_at: string;
}

export interface ShopStats {
  views: number;
  inquiries: number;
  viewsThisWeek: number;
  inquiriesThisWeek: number;
}
