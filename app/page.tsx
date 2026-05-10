import { ApiSection, CTABanner, FAQ, FeatureCards, HowItWorks, PricingPreview, Testimonials } from "@/components/sections/marketing-sections";
import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Testimonials />
      <PricingPreview />
      <ApiSection />
      <FAQ />
      <CTABanner />
    </main>
  );
}
