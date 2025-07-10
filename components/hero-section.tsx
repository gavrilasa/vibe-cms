'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}

export function HeroSection() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    setIsVisible(true);
  }, []);

  const defaultContent = {
    title: "Engineering Excellence",
    subtitle: "CV Reswara Praptama",
    description: "Delivering innovative engineering solutions with precision, expertise, and commitment to excellence. Your trusted partner for complex engineering challenges."
  };

  const content = heroContent || defaultContent;

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-delayed">
          <div className="w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float">
          <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm"></div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`text-center lg:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Floating Tags */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
                <Sparkles className="inline w-4 h-4 mr-2" />
                Professional
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium animate-fade-in delay-200">
                <Zap className="inline w-4 h-4 mr-2" />
                Innovative
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium animate-fade-in delay-400">
                Excellence
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white/90 mb-4 tracking-wide uppercase animate-fade-in delay-300">
              {content.subtitle}
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in delay-500">
              {content.title}
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                Solutions
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl animate-fade-in delay-700">
              {content.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-900">
              <button className="group bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="flex items-center justify-center">
                  Get Started
                  <ChevronDown className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">RP</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Reswara Praptama</h3>
                <p className="text-white/80 mb-6">Professional Engineering Consultant</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">10+</div>
                    <div className="text-sm text-white/70">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">50+</div>
                    <div className="text-sm text-white/70">Projects Completed</div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
                98% Success Rate
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce delay-500">
                25+ Happy Clients
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-white/70" />
      </div>
    </div>
  );
}