import HeroSection from "./HeroSection";

const backgroundImage = new URL(
  "../assets/image/construction-bg.jpeg",
  import.meta.url
).href;

const HeroContainer = () => {
  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat h-[600px] mt-60"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
      }}
    >
      <HeroSection />
    </div>
  );
};

export default HeroContainer;
