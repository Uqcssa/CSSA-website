import About from "@/components/Home/About";
import ImagesSliderDemo from "../components/static/slider"
import StickyScrollRevealDemo from "@/components/Home/stickyScroll";
import Classes from "@/components/Home/Classes";
import Team from "@/components/Home/Team";
import { AppleCardsCarouselDemo } from "@/components/Home/AppleCards";
export default async function Home() {
  
    return (
      <main>
        <ImagesSliderDemo/>
        <About/>
        <Classes/>
        <Team/>
        
        <StickyScrollRevealDemo/>  
      </main>
    );
}
