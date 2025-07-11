'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Eye, Sparkles } from 'lucide-react';

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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [filteredPortfolios.length]);

  // Default portfolios for demo
  const defaultPortfolios = [
    {
      id: '1',
      title: 'Modern Office Complex',
      description: 'A state-of-the-art office building featuring sustainable design principles and innovative structural solutions.',
      imageUrl: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
      category: 'Structural Engineering',
      projectUrl: null,
      order: 1,
    },
    {
      id: '2',
      title: 'Industrial Automation System',
      description: 'Complete automation solution for manufacturing facility, improving efficiency by 40% and reducing operational costs.',
      imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      category: 'Mechanical Design',
      projectUrl: null,
      order: 2,
    },
    {
      id: '3',
      title: 'Smart Infrastructure Project',
      description: 'Integrated smart city infrastructure with IoT sensors and real-time monitoring systems for urban management.',
      imageUrl: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
      category: 'Electrical Systems',
      projectUrl: null,
      order: 3,
    },
  ];

  const displayPortfolios = portfolios.length > 0 ? filteredPortfolios : defaultPortfolios;

  if (displayPortfolios.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-red-400 to-orange-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Sparkles size={16} />
            <span>Our Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our successful engineering projects and innovative solutions that have transformed industries
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
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {displayPortfolios.map((portfolio, index) => (
            <div
              key={portfolio.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredCard(portfolio.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                {portfolio.imageUrl ? (
                  <img
                    src={portfolio.imageUrl}
                    alt={portfolio.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Eye className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    {portfolio.category}
                  </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {portfolio.projectUrl && (
                    <a
                      href={portfolio.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {portfolio.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {portfolio.description}
                </p>
                
                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1 mb-4 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-1000 ${
                      hoveredCard === portfolio.id ? 'w-full' : 'w-0'
                    }`}
                  ></div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <button className="text-red-600 font-semibold hover:text-orange-500 transition-colors duration-300 flex items-center space-x-2">
                    <span>View Details</span>
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors duration-300">
                      <ChevronRight size={12} className="text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </button>
                  
                  {/* Floating Elements */}
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-300 ${
                          hoveredCard === portfolio.id 
                            ? 'opacity-100 animate-pulse' 
                            : 'opacity-30'
                        }`}
                        style={{ animationDelay: `${i * 200}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                hoveredCard === portfolio.id 
                  ? 'shadow-2xl shadow-red-500/20' 
                  : ''
              }`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 mb-6">
              Let's discuss how we can bring your engineering vision to life with our expertise and innovation.
            </p>
            <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Start Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}