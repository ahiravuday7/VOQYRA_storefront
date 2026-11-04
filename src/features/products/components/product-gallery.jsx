import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { ImageWithFallback } from "@/components/common/image-with-fallback";

function ProductGallery({ images = [], productName }) {
  const sortedImages = [...images].sort(
    (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0),
  );

  const [activeImageId, setActiveImageId] = useState(() => sortedImages[0]?.id ?? null);

  const activeImage =
    sortedImages.find((image) => image.id === activeImageId) ?? sortedImages[0] ?? null;

  return (
    <div className="min-w-0 w-full max-w-full">
      {/* Mobile */}
      <div className="min-w-0 w-full max-w-full overflow-hidden md:hidden">
        <Swiper
          className="min-w-0 w-full max-w-full"
          modules={[Pagination]}
          pagination={{
            clickable: true,
          }}
          spaceBetween={12}
          slidesPerView={1}
        >
          {sortedImages.length > 0 ? (
            sortedImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
                  <ImageWithFallback
                    src={image.url ?? ""}
                    alt={image.altText || productName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
                <ImageWithFallback
                  src=""
                  alt={productName}
                  className="h-full w-full object-cover"
                />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="aspect-[4/5] overflow-hidden rounded-lg bg-cloud/30">
          <ImageWithFallback
            src={activeImage?.url ?? ""}
            alt={activeImage?.altText || productName}
            className="h-full w-full object-cover"
          />
        </div>

        {sortedImages.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {sortedImages.map((image) => {
              const isActive = image.id === activeImage?.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveImageId(image.id)}
                  className={`aspect-[4/5] overflow-hidden rounded-md border ${
                    isActive ? "border-ink" : "border-cloud"
                  }`}
                >
                  <ImageWithFallback
                    src={image.url ?? ""}
                    alt={image.altText || productName}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductGallery };
