export type Env = {
  DB: D1Database;
  SESSION_SECRET?: string;
  ADMIN_BOOTSTRAP_PASSWORD?: string;
};

export type AuthedUser = {
  id: string;
  username: string;
  role: "admin";
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  specs_json: string;
  images_json: string;
  is_active: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
};

