import HeroSection from "./app/components/heroSection";
import Header from "./components/header";

export default function Home() {
  return (
    <div className="w-dvw h-dvh flex flex-col overflow-hidden">
      <Header value="root" />
      <HeroSection />
    </div>
  );
}
