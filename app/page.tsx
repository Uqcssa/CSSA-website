import About from "@/components/Home/About";
import ImagesSliderDemo from "../components/static/slider"
import StickyScrollRevealDemo from "@/components/Home/stickyScroll";
import Classes from "@/components/Home/Classes";
import Team from "@/components/Home/Team";
import { EventsSlider } from "@/components/Home/eventsSlider";
export default async function Home() {
  
    return (
      <main>
        <ImagesSliderDemo/>
        <About/>
        <Classes/>
        <Team/>
        <EventsSlider/>
        {/* <StickyScrollRevealDemo/>   */}
      </main>
    );
}
