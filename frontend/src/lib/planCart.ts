export interface PlanCartItem {
  section: string;
  id: string;
  title: string;
  price?: number | null;
  originalPrice?: number | null;
  currency?: string;
  description?: string;
  features?: string[];
  details?: Record<string, unknown>;
}

const CART_STORAGE_KEY = 'select-plan-cart';
export const PLAN_CART_UPDATED_EVENT = 'select-plan-cart-updated';
export const PLAN_CART_ITEM_ADDED_EVENT = 'select-plan-cart-item-added';

function isCartItem(value: unknown): value is PlanCartItem {
  return !!value
    && typeof value === 'object'
    && typeof (value as PlanCartItem).section === 'string'
    && typeof (value as PlanCartItem).id === 'string'
    && typeof (value as PlanCartItem).title === 'string';
}

export function readPlanCart(): PlanCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function writePlanCart(items: PlanCartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(PLAN_CART_UPDATED_EVENT));
}

export function addPlanToCart(plan: PlanCartItem) {
  const items = readPlanCart();
  const planKey = `${plan.section}:${plan.id}`;
  const nextItems = [
    ...items.filter(item => `${item.section}:${item.id}` !== planKey),
    { ...plan, currency: plan.currency || 'EGP' },
  ];
  writePlanCart(nextItems);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<PlanCartItem>(PLAN_CART_ITEM_ADDED_EVENT, { detail: plan }));
  }
  return nextItems;
}

export function clearPlanCart() {
  writePlanCart([]);
}
