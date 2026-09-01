import { Route, Routes } from "react-router-dom";

import { CartPage } from "@/pages/cart";
import { CatalogPage } from "@/pages/catalog";
import { HomePage } from "@/pages/home";
import { ProductPage } from "@/pages/product";
import { ROUTES } from "@/shared/constants/routes";
import { FavoritesPage } from "@/pages/favorites";
import { ProfilePage } from "@/pages/profile";
import { DeliveryPage } from "@/pages/delivery";
import { ContactsPage } from "@/pages/contacts";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { OrdersPage } from "@/pages/orders";
import { AddressesPage } from "@/pages/addresses";
import { SettingsPage } from "@/pages/settings";
import { CheckoutPage } from "@/pages/checkout";
import { AdminDashboardPage } from "@/pages/admin/dashboard";
import { AdminProductsPage } from "@/pages/admin/products";
import { AdminCategoriesPage } from "@/pages/admin/categories/AdminCategoriesPage.tsx";
import { AdminBrandsPage } from "@/pages/admin/brands";
import { AdminOrdersPage } from "@/pages/admin/orders";
import { AdminUsersPage } from "@/pages/admin/users";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<HomePage />} />
      <Route path={ROUTES.catalog} element={<CatalogPage />} />
      <Route path={ROUTES.product} element={<ProductPage />} />
      <Route path={ROUTES.cart} element={<CartPage />} />
      <Route path={ROUTES.favorites} element={<FavoritesPage />} />
      <Route path={ROUTES.profile} element={<ProfilePage />} />
      <Route path={ROUTES.delivery} element={<DeliveryPage />} />
      <Route path={ROUTES.contacts} element={<ContactsPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />
      <Route path={ROUTES.profile} element={<ProfilePage />} />
      <Route path={ROUTES.orders} element={<OrdersPage />} />
      <Route path={ROUTES.favorites} element={<FavoritesPage />} />
      <Route path={ROUTES.addresses} element={<AddressesPage />} />
      <Route path={ROUTES.settings} element={<SettingsPage />} />
      <Route path={ROUTES.checkout} element={<CheckoutPage />} />
      <Route path={ROUTES.admin} element={<AdminDashboardPage />} />
      <Route path={ROUTES.adminProducts} element={<AdminProductsPage />} />
      <Route path={ROUTES.adminCategories} element={<AdminCategoriesPage />} />
      <Route path={ROUTES.adminBrands} element={<AdminBrandsPage />} />
      <Route path={ROUTES.adminOrders} element={<AdminOrdersPage />} />
      <Route path={ROUTES.adminUsers} element={<AdminUsersPage />} />
    </Routes>
  );
};
