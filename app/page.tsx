import Header from "@/components/main/Header";
import Hero from "@/components/main/Hero";
import Features from "@/components/main/Features";
import Pricing from "@/components/main/Pricing";
import Testimonials from "@/components/main/Testimonials";
import Footer from "@/components/main/Footer";
import CTA from "@/components/main/cta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}