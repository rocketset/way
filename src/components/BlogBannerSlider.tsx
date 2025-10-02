import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import blogBanner1 from "@/assets/blog-banner-1.png";

// Mock data for banners - future admin panel will provide this
const banners = [
  {
    id: 1,
    desktopImage: blogBanner1,
    mobileImage: blogBanner1, // Future: different image for mobile
    alt: "Banner E-commerce Way",
  },
  // Future banners will be added here from admin panel
];

const BlogBannerSlider = () => {
  return (
    <section className="w-full pt-20">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full">
                {/* Desktop Image */}
                <img
                  src={banner.desktopImage}
                  alt={banner.alt}
                  className="hidden md:block w-full h-auto object-cover"
                />
                {/* Mobile Image */}
                <img
                  src={banner.mobileImage}
                  alt={banner.alt}
                  className="md:hidden w-full h-auto object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </section>
  );
};

export default BlogBannerSlider;
