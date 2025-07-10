'use client';

import { useState, useEffect } from 'react';
import { Wrench, Building, Calculator, Zap, Cog, Shield } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

const iconMap = {
  Wrench,
  Building,
  Calculator,
  Zap,
  Cog,
  Shield,
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('services');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const defaultServices = [
    {
      id: '1',
      title: 'Structural Engineering',
      description: 'Design and analysis of building structures, ensuring safety and compliance with industry standards.',
      icon: 'Building',
      order: 1,
    },
    {
      id: '2',
      title: 'Mechanical Design',
      description: 'Innovative mechanical system design and optimization for industrial and commercial applications.',
      icon: 'Cog',
      order: 2,
    },
    {
      id: '3',
      title: 'Project Management',
      description: 'Comprehensive project management services from conception to completion.',
      icon: 'Shield',
      order: 3,
    },
    {
      id: '4',
      title: 'Technical Consulting',
      description: 'Expert technical consultation and problem-solving for complex engineering challenges.',
      icon: 'Wrench',
      order: 4,
    },
    {
      id: '5',
      title: 'Quality Assurance',
      description: 'Rigorous quality control and assurance processes to ensure project excellence.',
      icon: 'Calculator',
      order: 5,
    },
    {
      id: '6',
      title: 'Electrical Systems',
      description: 'Electrical system design, installation, and maintenance for various applications.',
      icon: 'Zap',
      order: 6,
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Engineering
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive engineering solutions tailored to meet your specific needs and requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Wrench;
            
            return (
              <div
                key={service.id}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                
                <div className="flex items-center text-purple-600 font-semibold group-hover:text-blue-600 transition-colors duration-300">
                  <span>Learn More</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}