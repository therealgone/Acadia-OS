import HeroSection from "./app/components/heroSection";
import Header from "./components/header";
import HeaderMobil from "./components/header-mobil"

export default function Home() {
  return (
    <div className="p-10 mb-10">
      {/* Header only visible on md (768px+) and larger */}
      <div className="hidden md:block">
        <Header value="root" />
      </div>
      <div className=" block md:hidden ">
        <HeaderMobil/>
      </div>

      <HeroSection />
    </div>
  );
}
