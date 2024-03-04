import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";

export const metadata = {
  title: "Next Property | Home Page",
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <InfoBoxes />
    </>
  );
};

export default HomePage;
