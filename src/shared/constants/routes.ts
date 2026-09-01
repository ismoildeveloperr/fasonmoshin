export const ROUTES = {
  home: "/",

  catalog: "/catalog",
  product: "/product/:productId",

  cart: "/cart",
  favorites: "/favorites",

  checkout: "/checkout",

  profile: "/profile",
  orders: "/orders",

  delivery: "/delivery",
  contacts: "/contacts",

  login: "/login",
  register: "/register",

  addresses: "/addresses",
  settings: "/settings",

  admin: "/admin",
  adminProducts: "/admin/products",
  adminCategories: "/admin/categories",
  adminBrands: "/admin/brands",
  adminOrders: "/admin/orders",
  adminUsers: "/admin/users",
} as const;
