import { Card, CardContent } from "../components/ui/card";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.webp";
// changed
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
const CarouselComponent = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const banners = [banner1, banner2, banner3];
  return (
    <div className="flex items-center justify-center md:mt-28 mt-10 text-black">
      
      <Carousel
        plugins={[plugin.current]}
        className="md:w-[900px] w-[300px]"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        
        <CarouselContent>
          
          {banners.map((banner, index) => (
            <CarouselItem key={index}>
              
              <div className="p-1">
                
                <Card>
                  
                  <CardContent className="flex items-center justify-center p-0 m-0">
                    
                    <img className="w-full h-full" src={banner} alt={`Banner ${index + 1}`} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious /> <CarouselNext />
      </Carousel>
    </div>
  );
};
export default CarouselComponent;
