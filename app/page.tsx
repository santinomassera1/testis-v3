import { BackgroundGrids } from "@/components/background-grids";
import { TestisChat } from "@/components/chat/TestisChat";
import { Hero } from "@/components/hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ROISection } from "@/components/sections/ROISection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section with Chat */}
      <section id="hero" className="relative flex items-center justify-center overflow-hidden">
        <Hero />
        <TestisChat />
      </section>
      
      {/* Marketing Sections */}
      <section id="estadisticas">
        <StatsSection />
      </section>
      <section id="caracteristicas">
        <FeaturesSection />
      </section>
      <section id="testimonios">
        <TestimonialsSection />
      </section>
      <section id="retorno">
        <ROISection />
      </section>
      <section id="precios">
        <PricingSection />
      </section>
      <CTASection />
      <Footer />
    </div>
  );
}
