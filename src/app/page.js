import Banner from "@/components/Banner";
import BrowseAllCTA from "@/components/BrowseAllCTA";
import Featured from "@/components/Featured";
import RentalStatistics from "@/components/RentalStatistics";
import TopLocations from "@/components/TopLocations";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <div className="">
      <Banner/>
      <Featured/>
      <WhyChooseUs/>
      <TopLocations/>
      <RentalStatistics/>
      <BrowseAllCTA/>
    </div>
  );
}
