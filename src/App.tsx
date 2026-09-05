import { useLocation } from "react-router-dom";

import { AppRouter } from "@/app/router";
import { ScrollToTop } from "@/shared/lib/ScrollToTop";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";

export const App = () => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!isAdminPage && <Header />}

      <AppRouter />

      {!isAdminPage && <Footer />}
    </>
  );
};
