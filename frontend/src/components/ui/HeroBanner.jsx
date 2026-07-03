import { useState, useEffect } from 'react';
import sayuranImg from '../../assets/images/banner/sayuran.png';
import dagingImg from '../../assets/images/banner/daging.png';
import buahImg from '../../assets/images/banner/buah.png';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Panen \n Hari Ini",
      subtitle: "Sayuran organik segar dari petani lokal.",
      button: "Lihat Sekarang",
      bgClass: "bg-emerald-900",
      image: sayuranImg, 
    },
    {
      title: "Diskon \n Daging Sapi",
      subtitle: "Dapatkan potongan harga untuk daging segar.",
      button: "Klaim Promo",
      bgClass: "bg-rose-900",
      image: dagingImg, 
    },
    {
      title: "Buah \n Segar Tropis",
      subtitle: "Tingkatkan imun dengan vitamin C alami.",
      button: "Beli Buah",
      bgClass: "bg-orange-900",
      image: buahImg, 
    }
  ];

  useEffect(() => {
    // Timer otomatis untuk memindahkan slide setiap 4 detik
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); 

    // Bersihkan interval ketika komponen unmount
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-sm h-48 md:h-70 mb-8 mx-4 md:mx-6 md:mt-6 transition-colors duration-1000 ${slides[currentSlide].bgClass}`}>
      
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          {/* Gambar Background tanpa filter hue-rotate agar warna aslinya keluar */}
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          
          <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 via-gray-900/50 to-transparent"></div>
          
          <div className="relative h-full flex flex-col justify-center p-6 md:p-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight tracking-tight whitespace-pre-line">
              {slide.title}
            </h2>
            <p className="text-gray-200 text-sm md:text-lg mb-6 max-w-50 md:max-w-xs">
              {slide.subtitle}
            </p>
            <button className="bg-emerald-500 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-lg self-start hover:bg-emerald-600 transition-colors shadow-lg text-sm md:text-base">
              {slide.button}
            </button>
          </div>
        </div>
      ))}
      
      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}