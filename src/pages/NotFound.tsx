import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-primary">404</h1>
          <p className="mb-6 text-lg sm:text-xl text-muted-foreground">{t("notfound.sub")}</p>
          <Link to="/">
            <Button className="btn-gradient">{t("notfound.back")}</Button>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">xtenovamart.com</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
