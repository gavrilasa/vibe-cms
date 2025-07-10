'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Eye } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category: string;
  projectUrl?: string | null;
  order: number;
}

export function PortfolioSection() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/admin/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolios(data);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('portfolio');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const categories = ['All', ...Array.from(new Set(portfolios.map(p => p.category)))];
  
  const filteredPortfolios = selectedCategory === 'All' 
    ? portfolios 
    : portfolios.filter(p => p.category === selectedCategory);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredPortfolios.length));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredPortfolios.length) % Math.max(1, filteredPortfolios.length));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    if (filteredPortfolios.length > 1) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [filteredPortfolios.length]);

  if (portfolios.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Our Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="text-red-600">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our successful engineering projects and innovative solutions
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel */}
        {filteredPortfolios.length > 0 && (
          <div className={`relative transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {filteredPortfolios.map((portfolio, index) => (
                  <div key={portfolio.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                      {/* Image */}
                      <div className="relative bg-gray-100">
                        {portfolio.imageUrl ? (
                          <img
                            src={portfolio.imageUrl}
                            alt={portfolio.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Eye className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {portfolio.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                          {portfolio.title}
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                          {portfolio.description}
                        </p>
                        {portfolio.projectUrl && (
                          <a
                            href={portfolio.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium w-fit"
                          >
                            <span>View Project</span>
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {filteredPortfolios.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {filteredPortfolios.length > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                {filteredPortfolios.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-red-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}