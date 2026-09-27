import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import About from "../components/About";
import Skills from "../components/Skills";
import Process from "../components/Process";
import Contact from "../components/Contact";
export default function Home() {
  const location = useLocation();
  const { language } = useLanguage();
  useEffect(() => {
    document.title = "Kam Ngai Lau — Filmmaking & AI Image-making";
    const id = location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      if (id)
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.key, location.hash]);
  return (
    <div className={language === "zh-Hant" ? "home is-traditional" : "home"}>
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Process />
      <Contact />
    </div>
  );
}
