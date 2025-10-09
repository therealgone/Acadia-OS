import HeroSection from "./app/components/heroSection";

import HeaderMobil from "./components/header-mobil"

export default function Home() {
  return (
    <div className=" ">
      {/* Header only visible on md (768px+) and larger */}
      <div className=" block md:hidden mb-10 ">
        <HeaderMobil/>
      </div>

      <HeroSection />
    </div>
  );
}
