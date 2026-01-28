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

export function productImages(p: Product) {
  try {
    const arr = JSON.parse(p.images_json);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function productSpecs(p: Product) {
  try {
    const obj = JSON.parse(p.specs_json);
    return obj && typeof obj === "object" ? (obj as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

