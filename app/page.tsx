import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ArcOfTheNight from "@/components/ArcOfTheNight";
import SignalChain from "@/components/SignalChain";
import FeaturedRelease from "@/components/FeaturedRelease";
import WorkGrid from "@/components/WorkGrid";
import TourMap from "@/components/TourMap";
import SoulAnchor from "@/components/SoulAnchor";
import InstagramGrid from "@/components/InstagramGrid";
import InnerCircle from "@/components/InnerCircle";
import Footer from "@/components/Footer";
import { getInstagramPosts } from "@/lib/instagram";

// ISR so the Instagram feed refreshes once Behold is connected.
export const revalidate = 86400;

export default async function Home() {
  const igPosts = await getInstagramPosts();

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
      <InstagramGrid posts={igPosts} />
      <InnerCircle />
      <Footer />
    </main>
  );
}
