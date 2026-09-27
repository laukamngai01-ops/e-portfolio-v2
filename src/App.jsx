import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LanguageProvider from "./context/LanguageProvider";
import { useLanguage } from "./context/LanguageContext";
import { useTracker } from "./hooks/useTracker";
import ProjectDetail from "./pages/ProjectDetail";
function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="not-found shell">
      <span>404</span>
      <h1>{t("OUT OF FRAME.", "畫面之外。")}</h1>
      <p>{t("This page could not be found.", "找不到此頁面。")}</p>
      <Link to="/" className="square-link">
        {t("Back to portfolio", "返回作品集")} ↗
      </Link>
    </section>
  );
}
function Portfolio() {
  useTracker();
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex="-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </main>
    </>
  );
}
export default function App() {
  return (
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  );
}
