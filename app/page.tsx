import { BackgroundGrids } from "@/components/background-grids";
import { Hero } from "@/components/hero";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import FinancialSimulator from "@/components/sections/FinancialSimulator";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";
import { StudentSurveySection } from "@/components/sections/StudentSurveySection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section id="hero" className="relative flex items-center justify-center overflow-hidden">
        <Hero />
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
      <section id="simulador">
        <FinancialSimulator />
      </section>
      <section id="precios">
        <PricingSection />
      </section>
      <CTASection />
      
      {/* Student Survey Section */}
      <section id="encuesta">
        <StudentSurveySection />
      </section>
      
      <Footer />
    </div>
  );
}
