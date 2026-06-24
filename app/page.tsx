import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ArcOfTheNight from "@/components/ArcOfTheNight";
import SignalChain from "@/components/SignalChain";
import FeaturedRelease from "@/components/FeaturedRelease";
import WorkGrid from "@/components/WorkGrid";
import TourMap from "@/components/TourMap";
import SoulAnchor from "@/components/SoulAnchor";
import InnerCircle from "@/components/InnerCircle";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <ArcOfTheNight />
      <SignalChain />
      <FeaturedRelease />
      <WorkGrid />
      <TourMap />
      <SoulAnchor />
      <InnerCircle />
      <Footer />
    </main>
  );
}
