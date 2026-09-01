import { useLocation } from "react-router-dom";

import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { AppRouter } from "@/app/router";

export const App = () => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}

      <AppRouter />

      {!isAdminPage && <Footer />}
    </>
  );
};
