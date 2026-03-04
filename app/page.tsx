import { headers } from "next/headers";

import { About } from "@/components/landing/About";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Stations } from "@/components/landing/Stations";
import { PaymentScreen } from "@/components/payment/PaymentScreen";

export const dynamic = "force-dynamic";

function isStationSubdomain(host: string): boolean {
  const subdomain = host.split(".")[0];
  return /^station\d+$/i.test(subdomain);
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (isStationSubdomain(host)) {
    return <PaymentScreen />;
  }

  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Stations />
      <Pricing />
      <Contact />
      <Footer />
    </>
  );
}
