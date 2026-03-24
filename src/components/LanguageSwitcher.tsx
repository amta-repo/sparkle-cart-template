import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="gap-1.5 text-xs font-medium"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      <Globe className="h-4 w-4" />
      {language === "fr" ? "EN" : "FR"}
    </Button>
  );
};

export default LanguageSwitcher;
