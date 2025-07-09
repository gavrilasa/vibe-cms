'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}

export function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await fetch('/api/admin/hero');
        if (response.ok) {
          const data = await response.json();
          setHeroContent(data);
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      }
    };

    fetchHeroContent();
  }, []);

  const defaultContent = {
    title: "Engineering Excellence",
    subtitle: "CV Reswara Praptama",
    description: "Delivering innovative engineering solutions with precision, expertise, and commitment to excellence. Your trusted partner for complex engineering challenges."
  };

  const content = heroContent || defaultContent;

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-gray-600/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-lg font-semibold text-blue-600 mb-4 tracking-wide uppercase">
              {content.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                Get Started
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-gray-100 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">RP</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reswara Praptama</h3>
                <p className="text-gray-600 mb-4">Professional Engineering Consultant</p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">10+</div>
                    <div className="text-sm text-gray-500">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-500">Projects Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-gray-400" />
      </div>
    </div>
  );
}