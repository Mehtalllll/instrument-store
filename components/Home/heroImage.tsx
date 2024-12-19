import React, { useRef } from 'react';

const HeroSection = () => {
  const images = [
    { src: './guitar-web-2560x700.jpg', alt: 'Guitar' },
    { src: './dj-web-2560x700.jpg', alt: 'DJ Setup' },
    { src: './microphone-web-2560x700.jpg', alt: 'Microphone' },
    { src: './soundcard-web-2560x700.jpg', alt: 'Soundcard' },
  ];

  const scrollContainerRef = useRef<HTMLInputElement | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollPosition = containerWidth * index;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (scrollContainerRef.current) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const containerWidth = container.clientWidth;
        const scrollLeft = container.scrollLeft;
        const index = Math.round(scrollLeft / containerWidth);

        scrollToImage(index);
      }, 100);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <main className=" w-fit h-fit overflow-hidden relative">
      <div
        ref={scrollContainerRef}
        className="flex w-fit h-fit overflow-x-scroll noscrollbar scroll-smooth hide-scrollbar "
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="w-fit h-44 sm:h-fit flex-shrink-0 object-cover object-center"
            style={{ width: '100vw' }} // عرض هر تصویر برابر با عرض کامل صفحه
          />
        ))}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 z-50 left-1/2 transform -translate-x-1/2 flex gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-gray-300 hover:bg-teal-500 transition"
              onClick={() => scrollToImage(index)}
            ></button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
